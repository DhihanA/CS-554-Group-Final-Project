# CS-554-Group-Final-Project
Our CS-554 Final Project

testing...

## Downloading Transactions History Document

To generate a Transactions History document in PDF format, ensure you have `wkhtmltopdf` installed on your system. Follow these steps:

### For Windows Users

1. **Download `wkhtmltopdf`**:
   - Visit the [wkhtmltopdf download page](https://wkhtmltopdf.org/downloads.html) and download the appropriate Windows installer.
   
2. **Install `wkhtmltopdf`**:
   - Double-click on the downloaded installer and follow the installation instructions.
   
3. **Add `wkhtmltopdf` to System Path**:
   - After installation, you need to add `wkhtmltopdf` to your system environment variables:
     - Search for "Environment Variables" in the Start menu search bar and open the "Edit the system environment variables" option.
     - In the System Properties window, click on the "Environment Variables" button.
     - Under "System variables", select the "Path" variable and click on "Edit".
     - Click on "New" and add the path to the directory where `wkhtmltopdf` is installed (e.g., `C:\Program Files\wkhtmltopdf\bin`).
     - Click "OK" to save the changes.

4. **Verify Installation**:
   - Open a new command prompt and type `wkhtmltopdf --version`. If installed correctly, you should see the version information printed to the console.

### Generating Transactions History Document

Once `wkhtmltopdf` is installed and added to your system path, you can generate the Transactions History document using the provided functionality in our project.


### For Mac Users

1. **Install Homebrew (if not already installed)**:
   - Homebrew is a package manager for macOS that simplifies the process of installing software. If you don't have Homebrew installed, you can install it by running the following command in your terminal:
     ```bash
     /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
     ```

2. **Install `wkhtmltopdf`**:
   - Once Homebrew is installed, you can install `wkhtmltopdf` by running the following command in your terminal:
     ```bash
     brew install Caskroom/cask/wkhtmltopdf
     ```

3. **Verify Installation**:
   - Open a new terminal window and type `wkhtmltopdf --version`. If installed correctly, you should see the version information printed to the terminal.

### Generating Transactions History Document

Once `wkhtmltopdf` is installed, you can generate the Transactions History document using the provided functionality in our project.
