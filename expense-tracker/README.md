# Bon Expense Tracker

A modern, responsive expense tracking application built with React, Dexie.js, and Recharts.

## Features

- **Dashboard**: Quick overview of your financial status.
- **Transaction Management**: Add, view, and delete transactions with ease.
- **Analytics**: Beautiful charts to visualize your spending habits and income streams.
- **Dynamic Data**: All UI elements are rendered dynamically based on your data.
- **Responsive Design**: Works perfectly on all devices, from desktop to mobile.
- **Local Storage**: Uses Dexie.js for fast, offline-first data persistence.
- **External API Ready**: Includes a dedicated API layer for integration with a Spring Boot backend.

## Tech Stack

- **Frontend**: React 19
- **Database**: Dexie.js (IndexedDB wrapper)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bon-expense-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Integration

The application is equipped with an API service layer located in `src/api/apiService.js`. You can configure the backend URL by setting the `VITE_API_URL` environment variable.

By default, it looks for a Spring Boot backend at `http://localhost:8080/api`.

## Currency

The application uses **Kenya Shilling (KSh)** as the default currency.

## License

This project is licensed under the MIT License.
