// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::process::Command;
use std::fs;

#[tauri::command]
fn list_keys() -> String {
  let output = Command::new("evremap").arg("list-keys").output().expect("Failed to run command");
    String::from_utf8_lossy(&output.stdout).into_owned()
}


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
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

    //device_names
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

    //device_names
    format!("{}\n", device_names) // Append a newline to the end
}

#[tauri::command]
fn update_toml_content(content: String) {
    // Use the standard library to write the content to the file
    if let Err(err) = fs::write("/home/mm/procect.toml", content) {
        eprintln!("Error writing to file: {}", err);
    }

    
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            list_keys,
            get_device_names,
            get_phys_names,
//            read_toml_content,
            update_toml_content
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
