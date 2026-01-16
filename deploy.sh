#!/bin/bash

# Project deployment script
# Usage: ./deploy.sh [start|stop|restart|status]

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

BACKEND_PID_FILE="$PROJECT_ROOT/.backend.pid"
FRONTEND_PID_FILE="$PROJECT_ROOT/.frontend.pid"

BACKEND_LOG="$PROJECT_ROOT/backend.log"
FRONTEND_LOG="$PROJECT_ROOT/frontend.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

is_running() {
    local pid_file=$1
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p "$pid" > /dev/null 2>&1; then
            return 0
        fi
    fi
    return 1
}

start_backend() {
    if is_running "$BACKEND_PID_FILE"; then
        print_warning "Backend is already running (PID: $(cat $BACKEND_PID_FILE))"
        return 1
    fi

    print_status "Starting backend server..."
    cd "$BACKEND_DIR"
    nohup npm run dev > "$BACKEND_LOG" 2>&1 &
    echo $! > "$BACKEND_PID_FILE"
    sleep 2

    if is_running "$BACKEND_PID_FILE"; then
        print_status "Backend started successfully (PID: $(cat $BACKEND_PID_FILE))"
    else
        print_error "Failed to start backend"
        return 1
    fi
}

start_frontend() {
    if is_running "$FRONTEND_PID_FILE"; then
        print_warning "Frontend is already running (PID: $(cat $FRONTEND_PID_FILE))"
        return 1
    fi

    print_status "Starting frontend server..."
    cd "$FRONTEND_DIR"
    nohup npm run dev > "$FRONTEND_LOG" 2>&1 &
    echo $! > "$FRONTEND_PID_FILE"
    sleep 2

    if is_running "$FRONTEND_PID_FILE"; then
        print_status "Frontend started successfully (PID: $(cat $FRONTEND_PID_FILE))"
    else
        print_error "Failed to start frontend"
        return 1
    fi
}

stop_backend() {
    if is_running "$BACKEND_PID_FILE"; then
        local pid=$(cat "$BACKEND_PID_FILE")
        print_status "Stopping backend (PID: $pid)..."
        kill "$pid" 2>/dev/null
        # Also kill child processes (nodemon spawns node)
        pkill -P "$pid" 2>/dev/null
        rm -f "$BACKEND_PID_FILE"
        print_status "Backend stopped"
    else
        print_warning "Backend is not running"
        rm -f "$BACKEND_PID_FILE"
    fi
}

stop_frontend() {
    if is_running "$FRONTEND_PID_FILE"; then
        local pid=$(cat "$FRONTEND_PID_FILE")
        print_status "Stopping frontend (PID: $pid)..."
        kill "$pid" 2>/dev/null
        pkill -P "$pid" 2>/dev/null
        rm -f "$FRONTEND_PID_FILE"
        print_status "Frontend stopped"
    else
        print_warning "Frontend is not running"
        rm -f "$FRONTEND_PID_FILE"
    fi
}

show_status() {
    echo ""
    echo "====== Service Status ======"

    if is_running "$BACKEND_PID_FILE"; then
        echo -e "Backend:  ${GREEN}Running${NC} (PID: $(cat $BACKEND_PID_FILE))"
    else
        echo -e "Backend:  ${RED}Stopped${NC}"
    fi

    if is_running "$FRONTEND_PID_FILE"; then
        echo -e "Frontend: ${GREEN}Running${NC} (PID: $(cat $FRONTEND_PID_FILE))"
    else
        echo -e "Frontend: ${RED}Stopped${NC}"
    fi

    echo ""
    echo "Logs:"
    echo "  Backend:  $BACKEND_LOG"
    echo "  Frontend: $FRONTEND_LOG"
    echo "============================"
}

show_logs() {
    local service=$1
    case $service in
        backend)
            if [ -f "$BACKEND_LOG" ]; then
                tail -f "$BACKEND_LOG"
            else
                print_error "Backend log not found"
            fi
            ;;
        frontend)
            if [ -f "$FRONTEND_LOG" ]; then
                tail -f "$FRONTEND_LOG"
            else
                print_error "Frontend log not found"
            fi
            ;;
        *)
            print_error "Usage: $0 logs [backend|frontend]"
            ;;
    esac
}

case "$1" in
    start)
        case "$2" in
            backend)
                start_backend
                ;;
            frontend)
                start_frontend
                ;;
            *)
                start_backend
                start_frontend
                show_status
                ;;
        esac
        ;;
    stop)
        case "$2" in
            backend)
                stop_backend
                ;;
            frontend)
                stop_frontend
                ;;
            *)
                stop_backend
                stop_frontend
                show_status
                ;;
        esac
        ;;
    restart)
        case "$2" in
            backend)
                stop_backend
                sleep 1
                start_backend
                ;;
            frontend)
                stop_frontend
                sleep 1
                start_frontend
                ;;
            *)
                stop_backend
                stop_frontend
                sleep 1
                start_backend
                start_frontend
                show_status
                ;;
        esac
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs "$2"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs} [backend|frontend]"
        echo ""
        echo "Commands:"
        echo "  start   [backend|frontend]  Start services (default: both)"
        echo "  stop    [backend|frontend]  Stop services (default: both)"
        echo "  restart [backend|frontend]  Restart services (default: both)"
        echo "  status                      Show service status"
        echo "  logs    backend|frontend    Tail service logs"
        echo ""
        echo "Examples:"
        echo "  $0 start           # Start both backend and frontend"
        echo "  $0 start backend   # Start only backend"
        echo "  $0 restart         # Restart both services"
        echo "  $0 stop frontend   # Stop only frontend"
        echo "  $0 logs backend    # View backend logs"
        exit 1
        ;;
esac

exit 0
