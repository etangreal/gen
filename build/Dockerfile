
# –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# BUILD IMAGE: phusion/passenger-nodejs
#
#	DOCUMENTATION:
# 				 URL: github.com/phusion/passenger-docker
#		VERSION-INFO: github.com/phusion/passenger-docker/blob/master/Changelog.md
#
#   RESOURCE: BaseImage-Docker
#		 URL: phusion.github.io/baseimage-docker
# 		 URL: github.com/phusion/baseimage-docker
#
# –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

FROM phusion/passenger-nodejs:latest
MAINTAINER Ernst Salzmann <ErnstSalzmann@gmail.com>

# -------------------------------------------------------------------------------------------------
# Set environment variables.
# -------------------------------------------------------------------------------------------------

ENV HOME /root
# ENV HOME /tmp
# ENV HOME /home/app

WORKDIR /home/app

# -------------------------------------------------------------------------------------------------
# SETUP: BASH & NPM (to user directory)
# -------------------------------------------------------------------------------------------------

# RUN echo "prefix = /home/app/.node" >> /home/app/.npmrc
# RUN echo "export PATH=$HOME/.node/bin:$PATH" >> .bashrc

# ENV PATH $HOME/.node/bin:$PATH
## RUN export PATH=$HOME/.node/bin:$PATH

# -------------------------------------------------------------------------------------------------
# ENABLE-INSECURE-KEY
# -------------------------------------------------------------------------------------------------

RUN /usr/sbin/enable_insecure_key

# -------------------------------------------------------------------------------------------------
# CONFIGURATION
# -------------------------------------------------------------------------------------------------

RUN echo "cd /vagrant" >> ~/.bashrc

# -------------------------------------------------------------------------------------------------
# LINUX APT-GET INSTALLS
# -------------------------------------------------------------------------------------------------

# RUN apt-get -y update

# -------------------------------------------------------------------------------------------------
# HACK: get NPM to work
# -------------------------------------------------------------------------------------------------

# NPM, in a Linux Container, see the current user as "nobody" (even though the user is actually "root")
#  this command will enable npm to run under USER "nobody"

# RUN npm config set unsafe-perm true

# -------------------------------------------------------------------------------------------------
# MONGODB
# -------------------------------------------------------------------------------------------------

# apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
# echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/10gen.list
# apt-get update
# apt-get install mongodb-10gen

# <----- OR ----->

# sudo apt-get install mongodb

# CREATE MONGO DB DATA FOLDER

# mkdir /data
# mkdir /data/db

# SETUP ENVIROMENT VARIABLES

# ENV MONGO_URL='mongodb://localhost:27017/gen'
# ENV ROOT_URL='http://localhost/'
# ENV MAIL_URL='smtp://user:password@mailhost:port/'
# ENV PORT=3000

# -------------------------------------------------------------------------------------------------
# APPLICATION SETUP
# -------------------------------------------------------------------------------------------------

# ADD ADDITIONAL DEAMONS

RUN mkdir /etc/service/gen
# ADD ../deploy/runit /etc/service/gen/run

# ADD APP TO THE IMAGE

# ADD webapp.conf /etc/nginx/sites-enabled/webapp.conf
# RUN mkdir /home/app/gen
# ADD ../deploy/gen /home/app/gen

# REBUILD NATIVE PACKAGES

# WORKDIR /home/app/gen
# rm -r /home/app/gen/node_modules/fibers
# rm -r /home/app/gen/node_modules/bcrypt
# npm install fibers@1.0.1
# npm install bcrypt@0.7.7

# -------------------------------------------------------------------------------------------------
# CLEANUP
# -------------------------------------------------------------------------------------------------

# RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# -------------------------------------------------------------------------------------------------
# expose port 80 and 433
# -------------------------------------------------------------------------------------------------

EXPOSE 80 # 443 3000 3001 8080

# -------------------------------------------------------------------------------------------------
# COMMAND (to execute after "spawning" a container)
# -------------------------------------------------------------------------------------------------

# Run baseimage-docker's init process
CMD ["/sbin/my_init"]

# -------------------------------------------------------------------------------------------------
# ENTRYPOINT
# -------------------------------------------------------------------------------------------------

# ENTRYPOINT [""]

# –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# END
# –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
