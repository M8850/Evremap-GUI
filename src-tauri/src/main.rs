use serde::{Deserialize, Serialize};
use std::fs;
use std::process::Command;

#[derive(Debug, Serialize, Deserialize)]
pub struct DualRoleConfig {
    pub input: Vec<String>,
    pub hold: Option<Vec<String>>,
    pub tap: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RemapConfig {
    pub input: Option<Vec<String>>,
    pub output: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MappingConfig {
    pub device_name: Option<String>,
    pub phys: Option<String>,
    pub dual_role: Option<Vec<DualRoleConfig>>,
    pub remap: Option<Vec<RemapConfig>>,
}

impl MappingConfig {
    pub fn from_file(path: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let toml_data = std::fs::read_to_string(path)?;

        // Workaround: Add brackets to the input field if missing
        let toml_data_with_brackets = add_brackets_to_input(&toml_data);

        //println!("TOML data with brackets:\n{}", toml_data_with_brackets);

        let config_file: ConfigFile = toml::from_str(&toml_data_with_brackets)?;

        //println!("Config file after deserialization: {:#?}", config_file);

        Ok(Self {
            device_name: Some(config_file.device_name),
            phys: Some(config_file.phys),
            dual_role: Some(config_file.dual_role),
            remap: Some(config_file.remap),
        })
    }
}

#[derive(Debug, Deserialize)]
struct ConfigFile {
    #[serde(default)]
    device_name: String,
    #[serde(default)]
    phys: String,
    #[serde(default)]
    dual_role: Vec<DualRoleConfig>,
    #[serde(default)]
    remap: Vec<RemapConfig>,
}

// Add this function to add brackets around input strings
fn add_brackets_to_input(toml_data: &str) -> String {
    let toml_data_with_brackets = toml_data
        .lines()
        .map(|line| {
            if let Some(index) = line.find("input") {
                let (before_input, after_input) = line.split_at(index);
                let mut result_line = before_input.to_string();

                if after_input.contains('=') && !after_input.contains('[') {
                    // Add brackets only if '=' is present and '[' is missing
                    let input_value = after_input
                        .split('=')
                        .last()
                        .map(|v| v.trim())
                        .unwrap_or_default();

                    result_line.push_str(&format!("input = [{}]", input_value));
                } else {
                    // Keep the line as is
                    result_line.push_str(after_input);
                }

                result_line
            } else {
                // Keep the line as is
                line.to_string()
            }
        })
        .collect::<Vec<String>>()
        .join("\n");

    //println!("TOML data after adding brackets:\n{}", toml_data_with_brackets);

    toml_data_with_brackets
}

#[tauri::command]
fn list_keys() -> String {
    let output = Command::new("evremap").arg("list-keys").output().expect("Failed to run command");
    String::from_utf8_lossy(&output.stdout).into_owned()
}

#[tauri::command]
fn get_device_names() -> String {
    let output = Command::new("evremap")
        .arg("list-devices")
        .output()
        .expect("Failed to run command");

    let output_string = String::from_utf8_lossy(&output.stdout).into_owned();

    let device_names = output_string
        .lines()
        .filter(|line| line.starts_with("Name: "))
        .map(|line| line.trim_start_matches("Name: ").to_string())
        .collect::<Vec<String>>()
        .join("\n");

    format!("{}\n", device_names) // Append a newline to the end
}

#[tauri::command]
fn get_phys_names() -> String {
    let output = Command::new("evremap")
        .arg("list-devices")
        .output()
        .expect("Failed to run command");

    let output_string = String::from_utf8_lossy(&output.stdout).into_owned();

    let device_names = output_string
        .lines()
        .filter(|line| line.starts_with("Phys: "))
        .map(|line| line.trim_start_matches("Phys: ").to_string())
        .collect::<Vec<String>>()
        .join("\n");

    format!("{}\n", device_names) // Append a newline to the end
}

#[tauri::command]
fn update_toml_content(content: String, file_path: String) {
    if let Err(err) = fs::write(&file_path, content) {
        eprintln!("Error writing to file {}: {}", file_path, err);
    }
}

#[tauri::command]
fn read_toml_content(file_path: String) -> Result<String, String> {
    let mapping_config = MappingConfig::from_file(&file_path);
    match mapping_config {
        Ok(config) => {
            let json_data = serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?;
            Ok(json_data)
        }
        Err(err) => Err(err.to_string()),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            list_keys,
            get_device_names,
            get_phys_names,
            read_toml_content,
            update_toml_content
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
