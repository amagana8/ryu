#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri_plugin_store::{PluginBuilder, StoreBuilder};
use tauri_plugin_sql::{Migration, MigrationKind, TauriSql};

fn main() {
    let context = tauri::generate_context!();

    let user = StoreBuilder::new(".user".parse().unwrap())
        .default("anilistId".to_string(), "".into())
        .default("anilistToken".to_string(), "".into())
        .default("mdSessionToken".to_string(), "".into())
        .default("mdRefreshToken".to_string(), "".into())
        .build();

    tauri::Builder::default()
        .menu(tauri::Menu::os_default(&context.package_info().name))
        .plugin(PluginBuilder::default().stores([user]).freeze().build())
        .plugin(TauriSql::default().add_migrations(
            "sqlite:ryu.db",
            vec![Migration {
                version: 1,
                description: "create library",
                sql: include_str!("../migrations/1.sql"),
                kind: MigrationKind::Up,
            }],
        ))
        .run(context)
        .expect("error while running tauri application");
}
