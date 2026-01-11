// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    Manager,
    menu::{Menu, MenuItem, PredefinedMenuItem}, // Added PredefinedMenuItem
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent}
};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle();

            let relaunch_item = MenuItem::with_id(app_handle, "relaunch", "Relaunch", true, None::<&str>)?;
            let quit_item = MenuItem::with_id(app_handle, "quit", "Quit", true, None::<&str>)?;

            // CORRECTED: Create the separator using PredefinedMenuItem
            let separator = PredefinedMenuItem::separator(app_handle)?;

            let menu = Menu::with_items(app_handle, &[
                &separator, // Separator is now a standard Menu Item
                &relaunch_item,
                &quit_item,
            ])?;

            let tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .title("Tauri App")
                .show_menu_on_left_click(false)

                .on_menu_event(move |app, event| match event.id.as_ref() {
                    "relaunch" => {
                        println!("Relaunching application...");
                        let _ = app.restart();
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {
                        // The separator item does not have an ID, so it won't trigger this branch.
                        println!("Unhandled menu item clicked: {:?}", event.id);
                    }
                })

                .on_tray_icon_event(|tray, event| match event {
                    TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } => {
                        println!("Left click on tray icon. Showing main window.");
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            if let Ok(false) = window.is_visible() {
                                let _ = window.show();
                            }
                            let _ = window.unminimize();
                            let _ = window.set_focus();
                        }
                    }
                    TrayIconEvent::Move { .. } => {}
                    _ => {
                        println!("Unhandled tray icon event: {event:?}");
                    }
                })

                .build(app)?;

            println!("System Tray Icon successfully initialized with Relaunch and Separator.");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}