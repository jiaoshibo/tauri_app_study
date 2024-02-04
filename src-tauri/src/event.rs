use tauri::{App, Manager};
use serde::{Serialize, Deserialize};
use crate::console;
#[derive(Serialize, Deserialize, Debug)]
#[derive(Clone)]
struct Greet {
    name:String,
    from_message:String,
}
#[derive(Serialize, Deserialize, Debug)]
struct GreetMessage {
    name:String
}
#[derive(Serialize, Deserialize, Debug, Clone)]
struct SystemType {
    system_type:String
}

pub fn listen_greet(app:&mut App){
    let callback_app_handle = app.app_handle().clone();
    app.listen_global("greet",move |ev|{
        let payload = ev.payload().unwrap_or_default();
        console::log_info("[rust emit]",payload);
        let greet_msg: GreetMessage = serde_json::from_str(&ev.payload().unwrap()).unwrap();
        let emit_payload = Greet {
            name: "从 rust 返回的事件信息".to_string(),
            from_message: greet_msg.name
        };


        callback_app_handle.emit_all("hello", emit_payload).unwrap();
    });

   /* let callback_app_handle = app.app_handle().clone();
    let _event_id = app.listen_global("greet",  move |event|{
        let greet_msg: Greet = serde_json::from_str(&event.payload().unwrap()).unwrap();
        let msg = format!("{:?}",greet_msg);
        console::log_info("[Rust Emit]", &*msg);
        let _ = &callback_app_handle.emit_all("hello",msg);
    });*/
}
pub fn listen_system_type (app:&mut App) {
    let callback_app_handle = app.app_handle().clone();
    app.listen_global("get_system_info", move |_| {
        let os_type = std::env::consts::OS;
        let payload = SystemType {
            system_type: os_type.parse().unwrap()
        };
        console::log_info("the system_type is:",os_type);
        // callback_app_handle.emit_all("get_system_info",payload).unwrap();
        callback_app_handle.emit_all("system_info",payload).unwrap();
    });
}