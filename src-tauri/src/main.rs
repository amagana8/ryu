#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri_plugin_store::{PluginBuilder, StoreBuilder};

fn main() {
    let context = tauri::generate_context!();

    let user = StoreBuilder::new(".user".parse().unwrap())
        .default("anilistId".to_string(), "".into())
        .default("anilistToken".to_string(), "".into())
        .default("mangadexToken".to_string(), "".into())
        .build();

    tauri::Builder::default()
        .menu(tauri::Menu::os_default(&context.package_info().name))
        .plugin(PluginBuilder::default().stores([user]).freeze().build())
        .run(context)
        .expect("error while running tauri application");
}
