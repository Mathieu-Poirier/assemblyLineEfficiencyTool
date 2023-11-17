import PySimpleGUI as sg
import psycopg2
from datetime import datetime

# Database connection parameters
db_params = {
    "host": "127.0.0.1",
    "database": "postgres",
    "user": "postgres",
    "password": "yo"
}

# Create a connection to the database
conn = psycopg2.connect(**db_params)

# Define the layout of the PySimpleGUI window
layout = [
    [sg.Text("Scan Barcode:")],
    [sg.InputText(key="barcode_input")],
    [sg.Button("Enter")],
    [sg.Text(size=(20, 1), key="output_text")]  # Display the previous barcode here
]

# Create the PySimpleGUI window
window = sg.Window("Barcode Scanner", layout)

# Event loop
while True:
    event, values = window.read()

    if event == sg.WIN_CLOSED:
        break
    elif event == "Enter":
        barcode = values["barcode_input"]

        # Run the SQL code to update the database
        cursor = conn.cursor()
        sql_query = "UPDATE efficiency SET parts_made = parts_made + 1, timestamp = NOW();"
        cursor.execute(sql_query, (barcode,))
        conn.commit()
        cursor.close()

        # Update the display to show the previous barcode
        window["output_text"].update(f"Previous Barcode: {barcode}")
        window["barcode_input"].update("")  # Clear the input field

        sg.popup("Database updated successfully!")

# Close the connection and the window when the loop exits
conn.close()
window.close()


