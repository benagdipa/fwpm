# Fixed Wireless Performance Manager (FWPM)

A comprehensive web application for managing and tracking fixed wireless network performance, devices, implementations, and configurations.

## Features

- **Dashboard**: Overview of network performance, device status, and recent projects
- **Network Performance Tracking**: Monitor and analyze network metrics
- **WNTD Tracker**: Track and manage wireless network termination devices
- **Implementation Tracker**: Manage and track implementation projects
- **Configuration & Tools**: Access network configuration tools
- **User Management**: Admin interface for managing users and roles

## Technology Stack

### Backend
- Django 5.1+
- Django REST Framework 3.15+
- PostgreSQL (database)
- Django CORS Headers
- Django Filter
- Djoser (authentication)

### Frontend
- Next.js 14.1+
- React 18.2+
- Material UI 5.15+
- Axios (API client)
- React Hook Form
- Chart.js / React-Chartjs-2

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- PostgreSQL (optional, can use SQLite for development)

### Backend Setup

1. **Set up a virtual environment**:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

2. **Install dependencies**:
   ```powershell
   pip install -r requirements.txt
   ```

3. **Configure environment variables** (create `.env` file):
   ```
   DEBUG=True
   SECRET_KEY=your-secret-key
   DATABASE_URL=sqlite:///db.sqlite3
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:3000
   ```

4. **Apply migrations and create superuser**:
   ```powershell
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. **Run the development server**:
   ```powershell
   python manage.py runserver
   ```

### Frontend Setup

1. **Install dependencies**:
   ```powershell
   cd fwpm_frontend
   npm install
   ```

2. **Configure environment variables** (create `.env.local` file):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

3. **Run the development server**:
   ```powershell
   npm run dev
   ```

4. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`

## Deployment

### Backend Deployment

1. Set `DEBUG=False` in production
2. Configure a proper database (PostgreSQL recommended)
3. Set up proper ALLOWED_HOSTS and CORS settings
4. Use Gunicorn as the WSGI server:
   ```powershell
   gunicorn fwpm_backend.wsgi:application
   ```

### Frontend Deployment

1. Build the Next.js application:
   ```powershell
   npm run build
   ```

2. Deploy the build files to your hosting provider or serve with:
   ```powershell
   npm start
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Material-UI for the component library
- Django REST Framework for the powerful API toolset
- Next.js team for the React framework

# Network Configuration Tool

A web application for managing network configurations, parameters, and tools.

## Features

- Network Service Descriptor (NSD) configuration management
- Network parameters management with filtering and sorting capabilities
- Change history logging for tracking modifications
- Modern UI with Material-UI components

## API Endpoints

The application includes the following API endpoints:

### Network Configuration Endpoints

#### GET /api/network-configurations/list

Returns a list of all network configurations.

Query parameters:
- `status` - Filter by status (e.g., 'Active', 'Draft', 'Testing')
- `tag` - Filter by tag (e.g., 'LTE', '5G', 'Urban')
- `device` - Filter by applicable device (e.g., 'eNodeB', 'gNodeB', 'MME')
- `author` - Filter by author email
- `search` - Search in name, description, and tags

#### GET /api/network-configurations/details

Returns details of specific network configurations.

Query parameters:
- `configId` - Filter by configuration ID
- `moClassName` - Filter by MO class name
- `parameterName` - Filter by parameter name (partial match)

### Network Parameters Endpoint

#### GET /api/network-parameters/list

Returns a list of all network parameters.

Query parameters:
- `model` - Filter by model (e.g., 'eNodeB', 'MME')
- `moClassName` - Filter by MO class name
- `system` - Filter by system (e.g., 'RAN', 'Core')
- `deployment` - Filter by deployment (e.g., 'Urban', '5G', 'All')

### Network Tools Endpoint

#### GET /api/network-tools/list

Returns a list of network tools.

Query parameters:
- `category` - Filter by category (e.g., 'Diagnostics', 'Security')
- `requiresAuthentication` - Filter by authentication requirement (true/false)
- `search` - Search in name, description, and category

### Change History Endpoint

#### GET /api/change-history/logs

Returns a list of change history logs.

Query parameters:
- `action` - Filter by action (e.g., 'Parameter Updated', 'User Login')
- `user` - Filter by user email (partial match)
- `status` - Filter by status (e.g., 'success', 'failed')
- `startDate` - Filter by start date (ISO format)
- `endDate` - Filter by end date (ISO format)

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```powershell
npm install
# or
yarn install
```

### Running the Development Server

```powershell
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3000.

### Building for Production

```powershell
npm run build
# or
yarn build
```

## Technology Stack

- Next.js - React framework for server-rendered applications
- Material-UI - React component library implementing Google's Material Design
- Axios - Promise-based HTTP client for the browser and Node.js
- MUI DataGrid - Feature-rich data table for React 