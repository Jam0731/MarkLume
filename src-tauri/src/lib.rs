use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize)]
pub struct FileContent {
    pub content: String,
    pub file_name: String,
    pub file_path: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub extension: String,
}

#[tauri::command]
fn read_file(path: String) -> Result<FileContent, String> {
    let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let file_name = Path::new(&path)
        .file_name()
        .map(|n| n.to_string_lossy().to_string())
        .unwrap_or_default();
    Ok(FileContent {
        content,
        file_name,
        file_path: path,
    })
}

#[tauri::command]
fn write_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_files(dir_path: String) -> Result<Vec<FileEntry>, String> {
    let entries = fs::read_dir(&dir_path).map_err(|e| e.to_string())?;
    let mut files = Vec::new();

    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        let name = path
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_default();
        let is_dir = path.is_dir();
        let extension = if is_dir {
            String::new()
        } else {
            path.extension()
                .map(|e| e.to_string_lossy().to_string())
                .unwrap_or_default()
        };

        // Only show markdown files and directories
        if is_dir || extension == "md" || extension == "markdown" || extension == "txt" {
            files.push(FileEntry {
                name,
                path: path.to_string_lossy().to_string(),
                is_dir,
                extension,
            });
        }
    }

    // Sort: directories first, then files alphabetically
    files.sort_by(|a, b| {
        if a.is_dir == b.is_dir {
            a.name.to_lowercase().cmp(&b.name.to_lowercase())
        } else if a.is_dir {
            std::cmp::Ordering::Less
        } else {
            std::cmp::Ordering::Greater
        }
    });

    Ok(files)
}

#[tauri::command]
fn create_file(path: String, content: Option<String>) -> Result<(), String> {
    let content = content.unwrap_or_default();
    fs::write(&path, content).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_file(path: String) -> Result<(), String> {
    let path = Path::new(&path);
    if path.is_dir() {
        fs::remove_dir_all(path).map_err(|e| e.to_string())
    } else {
        fs::remove_file(path).map_err(|e| e.to_string())
    }
}

#[tauri::command]
fn rename_file(old_path: String, new_path: String) -> Result<(), String> {
    fs::rename(&old_path, &new_path).map_err(|e| e.to_string())
}

#[tauri::command]
fn path_exists(path: String) -> Result<bool, String> {
    Ok(Path::new(&path).exists())
}

#[tauri::command]
fn is_directory(path: String) -> Result<bool, String> {
    Ok(Path::new(&path).is_dir())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            read_file,
            write_file,
            list_files,
            create_file,
            delete_file,
            rename_file,
            path_exists,
            is_directory
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
