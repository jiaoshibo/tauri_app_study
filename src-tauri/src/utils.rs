use crate::console;
use tauri::{CustomMenuItem, Manager, Menu, Runtime, Window};
use window_shadows::set_shadow;

#[tauri::command]
pub fn log_axios_message(message: &str) {
    console::log_info("[log_axios_message]", &message);
}

pub fn create_menu() -> Menu {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let close = CustomMenuItem::new("close".to_string(), "Close");
    let back = CustomMenuItem::new("back".to_string(), "Back");
    let forward = CustomMenuItem::new("forward".to_string(), "Forward");
    // let submenu = Submenu::new("Control", Menu::new().add_item(quit).add_item(close).add_item());
    let menu = Menu::new()
        .add_item(quit)
        .add_item(close)
        .add_item(back)
        .add_item(forward);
    return menu;
}

#[tauri::command]
pub fn close_splashscreen(window: Window) {
    window
        .get_window("splashscreen")
        .expect("no window label 'splashscreen' found")
        .close()
        .unwrap();
    window
        .get_window("main")
        .expect("no window label 'main' found")
        .show()
        .unwrap();
}

pub fn set_window_shadow<R: Runtime>(app: &tauri::App<R>) {
    let main_window = app.get_window("main").unwrap();
    let splashscreen_window = app.get_window("splashscreen").unwrap();
    set_shadow(&main_window, true).expect("Unsupported platform!");
    set_shadow(&splashscreen_window, true).expect("Unsupported platform!");
}
