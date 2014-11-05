
# INSTALLATION:

	These install instructions where designed & tested for the use with Mac OSX.

# PREREQUISITES:

	- Homebrew
	- VirtualBox
	- Vagrant
	- node.js & npm

# INSTALL HOMEBREW:

	ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

	brew update
	brew doctor
	export PATH="/usr/local/bin:$PATH"

# INSTALL VIRTUALBOX & VAGRANT:

	brew tap caskroom/homebrew-cask
	brew install brew-cask
	brew cask install virtualbox
	brew cask install vagrant

# INSTALL NODE.JS & NPM:

	brew install node

# CLONE THE CODEVIZ REPOSITORY:

	git clone https://github.com/etangreal/chat.git

# BUILD:

	cd build && vagrant up && vagrant ssh
	cd build && docker build -t etangreal/genioo .

# RUN:

	CID=$(docker run -d -ti -p 80:80 -v $(pwd)/..:/vagrant etangreal/genioo) && echo $CID
	CIP=$(docker inspect $CID | grep IPAddress | cut -d '"' -f 4) && echo $CIP

# LOGIN:

	ssh -o "StrictHostKeyChecking no" -i ./docker/insecure_key root@$CIP

# CLEANUP:

	docker stop $CID && docker rm $CID
	docker ps -a

	docker rmi etangreal/genioo

# END
