// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod console;
mod utils;

use utils::{close_splashscreen, create_menu, log_axios_message, set_window_shadow};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .menu(create_menu())
        .setup(|app| {
            set_window_shadow(app);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            log_axios_message,
            close_splashscreen
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
