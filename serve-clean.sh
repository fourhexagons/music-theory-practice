#!/bin/bash
# Kill any running firebase serve processes
pkill -f "firebase serve"
# Start a new server
firebase serve --only hosting 