use ansi_term::Color;

pub fn log_info(title: &str, content: &str) {
    println!("😊 {} \t {}", Color::Green.bold().paint(title), content);
}
