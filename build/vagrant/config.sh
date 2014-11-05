#!/bin/sh -e

# GIVE THIS FILE EXECUTION PERMISSION
# chmod 755 bundle.sh

cp .bash_profile tmp
rm .bash_profile
mv tmp .bash_profile
echo "cd ~/share" >> .bash_profile