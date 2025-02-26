#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <algorithm> 
#include <sstream>   

// User Structure
struct User {
    std::string username;
    std::string password;
    std::string role; // Patient, Nurse, Doctor, Pharmacist
};

// Patient Structure
struct Patient {
    std::string name;
    int age;
    bool hasCancer = false;
    int cancerStage = 0;    // 0 if not applicable,1-4 if applicable
    bool hasDiabetes = false;
    int diabetesType = 0;   // 0 if none, 1 for Type 1, 2 for Type 2
    bool isSmoker = false;
    int smokingTreatmentOption = 0; // 0 if not smoker; 1 = 1 pack per month, 2 = 1 pack per week, 3 = 1 pack per day
};

std::vector<Patient> patients;

// Utility function: Convert string to lowercase
std::string toLowerCase(const std::string& str) {
    std::string lowerStr = str;
    std::transform(lowerStr.begin(), lowerStr.end(), lowerStr.begin(), ::tolower);
    return lowerStr;
}

// ----- File I/O for Patients -----------------------------------------------------------------------------------------------

// Load file "patients.txt" into the vector - The patient's full name is stored until a |
void loadPatients() {
    patients.clear();
    std::ifstream file("patients.txt");
    if (file.is_open()) {
        std::string line;
        while (std::getline(file, line)) {
            std::istringstream iss(line);
            Patient p;
            std::getline(iss, p.name, '|');  // Read full name until the '|' delimiter
            iss >> p.age >> p.hasCancer >> p.cancerStage
                >> p.hasDiabetes >> p.diabetesType >> p.isSmoker >> p.smokingTreatmentOption;
            patients.push_back(p);
        }
        file.close();
    }
}

// Append a patient to "patients.txt"
void savePatient(const Patient& p) {
    std::ofstream file("patients.txt", std::ios::app);
    if (file.is_open()) {
        // Use '|' as a delimiter to separate the full name from the rest of the data.
        file << p.name << "|" << " " << p.age << " "
            << p.hasCancer << " " << p.cancerStage << " "
            << p.hasDiabetes << " " << p.diabetesType << " "
            << p.isSmoker << " " << p.smokingTreatmentOption << "\n";
        file.close();
    }
    else {
        std::cout << "Error opening patients file!\n";
    }
}

// Update entire patients file 
void updatePatientsFile() {
    std::ofstream file("patients.txt", std::ios::out);
    if (file.is_open()) {
        for (const auto& p : patients) {
            file << p.name << "|" << " " << p.age << " "
                << p.hasCancer << " " << p.cancerStage << " "
                << p.hasDiabetes << " " << p.diabetesType << " "
                << p.isSmoker << " " << p.smokingTreatmentOption << "\n";
        }
        file.close();
    }
    else {
        std::cout << "Error updating patients file!\n";
    }
}

// ----- User Functions --------------------------------------------------------------------------

// Display login menu for login or patient registration
void displayLoginMenu() {
    std::cout << "\n--- NHS Patient Management System ---\n";
    std::cout << "1. Login\n";
    std::cout << "2. Patient Registration\n";
    std::cout << "3. Exit\n";
    std::cout << "Enter your choice: ";
}

// Register a new user (Doctors only, except for Pharmacist accounts)
void registerUser(const std::string& currentRole) {
       if (toLowerCase(currentRole) != "doctor" && toLowerCase(currentRole) != "nurse") {
        std::cout << "Access denied! Only doctors can register new users.\n";
        return;
    }
    User newUser;
    std::cout << "Enter new username: ";
    std::cin >> newUser.username;
    std::cout << "Enter new password: ";
    std::cin >> newUser.password;
    std::cout << "Enter role (Patient/Nurse/Doctor): ";
    std::cin >> newUser.role;

    std::ofstream file("users.txt", std::ios::app);
    if (file.is_open()) {
        file << newUser.username << " " << newUser.password << " " << newUser.role << "\n";
        file.close();
        std::cout << "User registered successfully!\n";
    }
    else {
        std::cout << "Error opening users file!\n";
    }
}

// Register a new pharmacist account (only pharmacists can do this)
void registerPharmacistUser() {
    User newUser;
    std::cout << "Enter username: ";
    std::cin >> newUser.username;
    std::cout << "Enter password: ";
    std::cin >> newUser.password;
    newUser.role = "pharmacist";

    std::ofstream file("users.txt", std::ios::app);
    if (file.is_open()) {
        file << newUser.username << " " << newUser.password << " " << newUser.role << "\n";
        file.close();
        std::cout << "Pharmacist account registered successfully!\n";
    }
    else {
        std::cout << "Error opening users file!\n";
    }
}

// Login function. Returns true if login is successful, and sets the role accordingly
bool loginUser(std::string& role, std::string& username) {
    std::string inputUser, inputPass, fileUser, filePass, fileRole;
    std::cout << "Enter username: ";
    std::cin >> inputUser;
    std::cout << "Enter password: ";
    std::cin >> inputPass;

    std::ifstream file("users.txt");
    if (file.is_open()) {
        while (file >> fileUser >> filePass >> fileRole) {
            if (fileUser == inputUser && filePass == inputPass) {
                role = fileRole;
                username = fileUser;
                file.close();
                std::cout << "Login successful! Welcome, " << role << ".\n";
                return true;
            }
        }
        file.close();
    }
    std::cout << "Invalid credentials!\n";
    return false;
}

// ----- Patient Functions ---------------------------------------------------------------------------------------------

// Function for patients to self-register their details with a full name (including spaces)
void patientRegistration() {
    Patient newPatient;
    std::cin.ignore(); // Clears the input buffer to ensure the data is being entered into the correct container
    std::cout << "\n--- Patient Registration ---\n";
    std::cout << "Enter your full name: ";
    std::getline(std::cin, newPatient.name);
    std::cout << "Enter your age: ";
    std::cin >> newPatient.age;

    std::cout << "Do you currently have cancer? (1 for yes, 0 for no): ";
    std::cin >> newPatient.hasCancer;
    if (newPatient.hasCancer) {
        std::cout << "Enter cancer stage (1-4): ";
        std::cin >> newPatient.cancerStage;
    }
    std::cout << "Do you currently have diabetes? (1 for yes, 0 for no): ";
    std::cin >> newPatient.hasDiabetes;
    if (newPatient.hasDiabetes) {
        std::cout << "Enter diabetes type (1 for Type 1, 2 for Type 2): ";
        std::cin >> newPatient.diabetesType;
    }
    std::cout << "Are you a smoker? (1 for yes, 0 for no): ";
    std::cin >> newPatient.isSmoker;
    if (newPatient.isSmoker) {
        std::cout << "Select smoking treatment option:\n";
        std::cout << "1. 1 pack per month (Nicotine Tablets: 1 pill/day)\n";
        std::cout << "2. 1 pack per week (Nicotine Tablets: 2 pills/day)\n";
        std::cout << "3. 1 pack per day (Nicotine Patch)\n";
        std::cout << "Enter option (1-3): ";
        std::cin >> newPatient.smokingTreatmentOption;
    }

    patients.push_back(newPatient);
    savePatient(newPatient);
    std::cout << "Patient registration completed successfully!\n";
}

// Function for doctors/nurses to add a new patient
void addPatient(const std::string& currentRole) {
    if (toLowerCase(currentRole) != "doctor" && toLowerCase(currentRole) != "nurse") {
        std::cout << "Access denied! Only doctors and nurses can add new patients.\n";
        return;
    }
    Patient newPatient;
    std::cin.ignore(); // Clears the input buffer to ensure the data is being entered into the correct container
    std::cout << "\n--- Add New Patient ---\n";
    std::cout << "Enter patient full name: ";
    std::getline(std::cin, newPatient.name);
    std::cout << "Enter patient age: ";
    std::cin >> newPatient.age;

    std::cout << "Does the patient have cancer? (1 for yes, 0 for no): ";
    std::cin >> newPatient.hasCancer;
    if (newPatient.hasCancer) {
        std::cout << "Enter cancer stage (1-4): ";
        std::cin >> newPatient.cancerStage;
    }
    std::cout << "Does the patient have diabetes? (1 for yes, 0 for no): ";
    std::cin >> newPatient.hasDiabetes;
    if (newPatient.hasDiabetes) {
        std::cout << "Enter diabetes type (1 for Type 1, 2 for Type 2): ";
        std::cin >> newPatient.diabetesType;
    }
    std::cout << "Is the patient a smoker? (1 for yes, 0 for no): ";
    std::cin >> newPatient.isSmoker;
    if (newPatient.isSmoker) {
        std::cout << "Select smoking treatment option:\n";
        std::cout << "1. 1 pack per month (Nicotine Tablets: 1 pill/day)\n";
        std::cout << "2. 1 pack per week (Nicotine Tablets: 2 pills/day)\n";
        std::cout << "3. 1 pack per day (Nicotine Patch)\n";
        std::cout << "Enter option (1-3): ";
        std::cin >> newPatient.smokingTreatmentOption;
    }

    patients.push_back(newPatient);
    savePatient(newPatient);
    std::cout << "Patient added successfully!\n";
}

// Function to view all patients
void viewPatients() {
    loadPatients();
    std::cout << "\n--- Patient List ---\n";
    for (const auto& p : patients) {
        std::cout << "Name: " << p.name << ", Age: " << p.age
            << ", Cancer: " << (p.hasCancer ? "Yes (Stage " + std::to_string(p.cancerStage) + ")" : "No")
            << ", Diabetes: " << (p.hasDiabetes ? "Yes (Type " + std::to_string(p.diabetesType) + ")" : "No")
            << ", Smoker: " << (p.isSmoker ? "Yes" : "No") << "\n";
    }
}

// ----- Calcuulate Statistics Function -------------------------------------------------------------------------------------
void calculateAverages() {
    loadPatients();
    int cancerCount = 0, diabetesCount = 0, smokerCancerCount = 0, smokerCount = 0;
    int sumCancerAge = 0, sumDiabetesAge = 0;

    for (const auto& p : patients) {
        if (p.hasCancer) {
            cancerCount++;
            sumCancerAge += p.age;
        }
        if (p.hasDiabetes) {
            diabetesCount++;
            sumDiabetesAge += p.age;
        }
        if (p.isSmoker) {
            smokerCount++;
            if (p.hasCancer)
                smokerCancerCount++;
        }
    }

    if (cancerCount > 0)
        std::cout << "Average age of patients with cancer: " << (sumCancerAge / (double)cancerCount) << "\n";
    else
        std::cout << "No patients with cancer found.\n";

    if (diabetesCount > 0)
        std::cout << "Average age of patients with diabetes: " << (sumDiabetesAge / (double)diabetesCount) << "\n";
    else
        std::cout << "No patients with diabetes found.\n";

    if (smokerCount > 0)
        std::cout << "Percentage of smoking patients with cancer: "
        << ((smokerCancerCount / (double)smokerCount) * 100) << "%\n";
    else
        std::cout << "No smoking patients found.\n";
}

// ----- Cost Calculation Function --------------------------------------------------------
void calculateAndDisplayCost(const Patient& p) {
    double cancerDaily = 0.0, diabetesDaily = 0.0, smokingDaily = 0.0;

    // Calculates cancer cost only if patient qualifies for chemotherapy (stages 1-3)
    if (p.hasCancer && p.cancerStage >= 1 && p.cancerStage <= 3) {
        double chemoCostPerRound = 10000.0;
        if (p.cancerStage == 1)
            cancerDaily = chemoCostPerRound / 28.0;
        else if (p.cancerStage == 2)
            cancerDaily = chemoCostPerRound / 14.0;
        else if (p.cancerStage == 3)
            cancerDaily = chemoCostPerRound / 7.0;
    }
    else {
        if (p.hasDiabetes) {
            if (p.diabetesType == 1)
                diabetesDaily = 2 * 7.52;
            else if (p.diabetesType == 2)
                diabetesDaily = 7.52;
        }
        if (p.isSmoker) {
            if (p.smokingTreatmentOption == 1)
                smokingDaily = 5.63 / 8.0;
            else if (p.smokingTreatmentOption == 2)
                smokingDaily = 5.63 / 4.0;
            else if (p.smokingTreatmentOption == 3)
                smokingDaily = 3.64;
        }
    }

    double totalDaily = cancerDaily + diabetesDaily + smokingDaily;

    double cancerWeekly = cancerDaily * 7;
    double diabetesWeekly = diabetesDaily * 7;
    double smokingWeekly = smokingDaily * 7;
    double totalWeekly = totalDaily * 7;

    double cancerMonthly = cancerDaily * 30;
    double diabetesMonthly = diabetesDaily * 30;
    double smokingMonthly = smokingDaily * 30;
    double totalMonthly = totalDaily * 30;

    double cancerYearly = cancerDaily * 365;
    double diabetesYearly = diabetesDaily * 365;
    double smokingYearly = smokingDaily * 365;
    double totalYearly = totalDaily * 365;

    std::cout << "\nCost Breakdown (per day):\n";
    std::cout << "  Cancer Cost: " << cancerDaily << " GBP\n";
    std::cout << "  Diabetes Cost: " << diabetesDaily << " GBP\n";
    std::cout << "  Smoking Cost: " << smokingDaily << " GBP\n";
    std::cout << "  Total Daily Cost: " << totalDaily << " GBP\n\n";

    std::cout << "Cost Breakdown (per week):\n";
    std::cout << "  Cancer Cost: " << cancerWeekly << " GBP\n";
    std::cout << "  Diabetes Cost: " << diabetesWeekly << " GBP\n";
    std::cout << "  Smoking Cost: " << smokingWeekly << " GBP\n";
    std::cout << "  Total Weekly Cost: " << totalWeekly << " GBP\n\n";

    std::cout << "Cost Breakdown (per month):\n";
    std::cout << "  Cancer Cost: " << cancerMonthly << " GBP\n";
    std::cout << "  Diabetes Cost: " << diabetesMonthly << " GBP\n";
    std::cout << "  Smoking Cost: " << smokingMonthly << " GBP\n";
    std::cout << "  Total Monthly Cost: " << totalMonthly << " GBP\n\n";

    std::cout << "Cost Breakdown (per year):\n";
    std::cout << "  Cancer Cost: " << cancerYearly << " GBP\n";
    std::cout << "  Diabetes Cost: " << diabetesYearly << " GBP\n";
    std::cout << "  Smoking Cost: " << smokingYearly << " GBP\n";
    std::cout << "  Total Yearly Cost: " << totalYearly << " GBP\n";
}

// Allows a doctor/nurse to look up a patient by full name and view their treatment cost
void viewPatientCost() {
    std::string searchName;
    std::cin.ignore();
    std::cout << "Enter patient full name to view treatment cost: ";
    std::getline(std::cin, searchName);

    bool found = false;
    for (const auto& p : patients) {
        if (p.name == searchName) {
            found = true;
            std::cout << "\nTreatment cost details for " << p.name << ":\n";
            calculateAndDisplayCost(p);
            break;
        }
    }
    if (!found)
        std::cout << "Patient not found.\n";
}

// Pharmacist-specific function: Allow pharmacist to edit a patients treatment details
void editPatientTreatment() {
    std::cin.ignore();
    std::string searchName;
    std::cout << "Enter patient full name to edit treatment details: ";
    std::getline(std::cin, searchName);

    bool found = false;
    for (auto& p : patients) {
        if (p.name == searchName) {
            found = true;
            std::cout << "Editing treatment details for " << p.name << "\n";
            int temp;
            std::cout << "Does the patient have cancer? (1 for yes, 0 for no): ";
            std::cin >> temp;
            p.hasCancer = temp;
            if (p.hasCancer) {
                std::cout << "Enter cancer stage (1-4): ";
                std::cin >> p.cancerStage;
            }
            else {
                p.cancerStage = 0;
            }
            std::cout << "Does the patient have diabetes? (1 for yes, 0 for no): ";
            std::cin >> temp;
            p.hasDiabetes = temp;
            if (p.hasDiabetes) {
                std::cout << "Enter diabetes type (1 for Type 1, 2 for Type 2): ";
                std::cin >> p.diabetesType;
            }
            else {
                p.diabetesType = 0;
            }
            std::cout << "Is the patient a smoker? (1 for yes, 0 for no): ";
            std::cin >> temp;
            p.isSmoker = temp;
            if (p.isSmoker) {
                std::cout << "Select smoking treatment option:\n";
                std::cout << "1. 1 pack per month (Nicotine Tablets: 1 pill/day)\n";
                std::cout << "2. 1 pack per week (Nicotine Tablets: 2 pills/day)\n";
                std::cout << "3. 1 pack per day (Nicotine Patch)\n";
                std::cout << "Enter option (1-3): ";
                std::cin >> p.smokingTreatmentOption;
            }
            else {
                p.smokingTreatmentOption = 0;
            }
            break;
        }
    }
    if (!found)
        std::cout << "Patient not found.\n";
    else {
        updatePatientsFile();
        std::cout << "Patient treatment details updated successfully!\n";
    }
}

// ----- Role-Specific Menus -------------------------------------------------

// Menu for Doctor/Nurse roles
void doctorNurseMenu(const std::string& role) {
    int choice;
    bool loggedIn = true;

    loadPatients();

    while (loggedIn) {
        std::cout << "\n--- " << role << " Menu ---\n";
        if (toLowerCase(role) == "doctor")
            std::cout << "1. Register new user (Doctors Only)\n";
        std::cout << "2. Add new patient\n";
        std::cout << "3. View all patients\n";
        std::cout << "4. View statistics\n";
        std::cout << "5. View treatment cost for a patient\n";
        std::cout << "6. Logout\n";
        std::cout << "Enter your choice: ";
        std::cin >> choice;

        switch (choice) {
        case 1:
            if (toLowerCase(role) == "doctor")
                registerUser(role);
            else
                std::cout << "Invalid choice.\n";
            break;
        case 2:
            addPatient(role);
            break;
        case 3:
            viewPatients();
            break;
        case 4:
            calculateAverages();
            break;
        case 5:
            viewPatientCost();
            break;
        case 6:
            loggedIn = false;
            break;
        default:
            std::cout << "Invalid option. Try again.\n";
        }
    }
}

// Menu for Patient
void patientMenu(const std::string& username) {
    int choice;
    bool loggedIn = true;

    while (loggedIn) {
        std::cout << "\n--- Patient Menu ---\n";
        std::cout << "1. View my treatment cost\n";
        std::cout << "2. Logout\n";
        std::cout << "Enter your choice: ";
        std::cin >> choice;

        if (choice == 1) {
            bool found = false;
            for (const auto& p : patients) {
                if (p.name == username) {
                    found = true;
                    std::cout << "\nYour treatment cost details:\n";
                    calculateAndDisplayCost(p);
                    break;
                }
            }
            if (!found)
                std::cout << "No patient record found for your account.\n";
        }
        else if (choice == 2) {
            loggedIn = false;
        }
        else {
            std::cout << "Invalid option. Try again.\n";
        }
    }
}

// Menu for Pharmacist 
void pharmacistMenu(const std::string& role) {
    int choice;
    bool loggedIn = true;

    loadPatients();

    while (loggedIn) {
        std::cout << "\n--- " << role << " Menu ---\n";
        std::cout << "1. Register new pharmacist account\n";
        std::cout << "2. View all patients\n";
        std::cout << "3. Edit patient treatment details\n";
        std::cout << "4. Logout\n";
        std::cout << "Enter your choice: ";
        std::cin >> choice;

        switch (choice) {
        case 1:
            // Only pharmacists can create pharmacist accounts.
            registerPharmacistUser();
            break;
        case 2:
            viewPatients();
            break;
        case 3:
            editPatientTreatment();
            break;
        case 4:
            loggedIn = false;
            break;
        default:
            std::cout << "Invalid option. Try again.\n";
        }
    }
}

// ----- Main Function ---------------------------------------------------------------------------------------------------------------------

int main() {
    int choice;
    std::string role, username;

    loadPatients();

    bool running = true;
    while (running) {
        displayLoginMenu();
        std::cin >> choice;
        switch (choice) {
        case 1: // Login
            if (loginUser(role, username)) {
                loadPatients();
                std::string roleLower = toLowerCase(role);
                if (roleLower == "doctor" || roleLower == "nurse") {
                    doctorNurseMenu(role);
                }
                else if (roleLower == "patient") {
                    patientMenu(username);
                }
                else if (roleLower == "pharmacist") {
                    pharmacistMenu(role);
                }
                else {
                    std::cout << "Role not recognised. Returning to main menu.\n";
                }
            }
            break;
        case 2: // Patient Registration
            patientRegistration();
            break;
        case 3:
            std::cout << "Exiting programme...\n";
            running = false;
            break;
        default:
            std::cout << "Invalid choice. Try again.\n";
        }
    }

    return 0;
}
