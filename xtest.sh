#!/bin/bash

function daemonize() {
	# super simple process daemon (not for serious tasks!)
	#
	# This function closes the file descriptors. For example, if you want to 
	# capture stdout and stderr change the commands to:
	#     exec 1>stdout.log
	#     exec 2>stderr.log

	local commands="$*"
	(
		exec 0>&-
		exec >&-
		exec 2>&-
		nohup $commands &
	) &
}

# cp the files to their correct spots
dir="/usr/share/lightdm-webkit/themes/tomahawk"
sudo cp index.html "$dir/"
sudo cp css/* "$dir/css/"
sudo cp js/* "$dir/js"
sudo cp img/* "$dir/img"

# start the xserver
cd /home/arno
daemonize Xephyr -ac -br -noreset -screen 1000x800 -resizeable :1
# give a sec to establish
sleep 1

# start the programs (wm first!)
export DISPLAY=:1.0
lightdm-webkit-greeter
