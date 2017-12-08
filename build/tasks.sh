#!/bin/bash

##########################
#
# Tasks used for building and runing the application.
# @package build
# @author Constantin Dumitrescu <dum.constantin@gmail.com>
#
##########################

APP_ENV=$1
TASK=$2
PARAM1=$3
PARAM2=$4
PARAM3=$5

GULP_SCRIPT="/app/node_modules/.bin/gulp --gulpfile /app/build/gulpfile.babel.js"
TASKS_SCRIPT="/app/build/tasks.sh ${APP_ENV}"

APP_PORT=80
APP_CONTAINER_NAME=jsonmvc-webpack.local
APP_IMAGE_NAME=jsonmvc-webpack-app

# Display variables
red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`
bold=`tput bold`
newline=$'\n'
separator_char="="

#####################
#     HELPERS       #
#####################

# Trim the leading and the trailling whitespace from the
# provided string
# @type helper
# @environment any
# @param string
trim() {
  echo "$(echo -e "${1}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
}

# Echoes a string consisting of a char repeated a number of times
# usage: repeatChar 10 "foo"
# @type helper
# @environment any
# @param number of repetition
# @param character
repeat_char() {
  times=$1
  char=$2
  result=""
  for ((i = 0; i < $times; i++)); do
    result="${result}${char}"
  done
  echo $result
}

# Wraps a text with around special chars
# Makes it easy to distinguish important sections.
# @type helper
# @environment any
# @param string
wrap_text() {
  chars=$(repeat_char 3 $separator_char)
  echo "${chars} ${1} ${chars}"
}

# Repeats an element so that it can hover on top
# or the bottom of the given text
# @type helper
# @environment any
# @param string
separator() {
  text=$1
  len=$(expr length "${text}")
  chars=$(repeat_char $len $separator_char)
  echo $chars
}

# Formats the text and wraps it to be displyed nicely on the screen
# @type helper
# @environment any
# @param string
format_text() {
  text=$1
  text=$(trim "${text}")
  text=$(wrap_text "${text}")

  echo $text
}

# Echos a title formated text that is easily distinguashable
# in the the terminal output
# @type helper
# @environment any
# @param string
title() {
  text=$(format_text "${1}")
  text_separator=$(separator "${text}")

  echo "${text_separator}${newline}${text}${newline}${text_separator}${newline}"
}
# Echos a subtitle formated text that is easily distinguashable
# in the the terminal output
# @type helper
# @environment any
# @param string
subtitle() {
  text=$(format_text "${1}")

  echo "${text}${newline}"
}

# Sets the hosts for the docker container on the local machine
# so that it can be accessed at http://appname
# @type helper
# @environment local machine
# @param host name
set_host() {
  IP="$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${1})"
  HOST=${1}

  sudo sed -i "/$HOST/ s/.*/$IP\t$HOST/g" /etc/hosts
  sudo grep $HOST /etc/hosts || echo "$IP $HOST" | sudo tee -a /etc/hosts
}

# Stops and removes a container
# @type helper
# @environment any
# @param container name
docker_rm() {
  docker rm -f $1 || :
}

# Holds the execution of a script until a port on a given port is opened
# UDP ports are not supported
# @type helper
# @environment any
# @param hostname
# @param port
wait_for_port() {

	host=$(echo "${1}_PORT_${2}_TCP_ADDR" | awk '{print toupper($0)}')
	port=$(echo "${1}_PORT_${2}_TCP_PORT" | awk '{print toupper($0)}')

  printf "Waiting for ${1}:${2} to be available "

	while [ "$(nmap -p ${!port} ${!host} 2>&1 | grep "tcp open")" = "" ]
	do
		printf "."
		sleep 1
	done

}

#####################
# APPLICATION TASKS #
#####################

# Starts the application container and the application server
# @type build
# @environment local machine
app_start() {
  app_stop

  if [ ! -f "./build/firebase.env" ]; then
    echo "

    Please create the /build/firebase.env file.

    "
    exit 0
  fi

  docker run \
    -v $PWD:/app \
    -h $APP_CONTAINER_NAME \
    -d \
    --env-file ./build/default.env \
    --env-file "./build/firebase.env" \
    -t \
    --name $APP_CONTAINER_NAME \
    $APP_IMAGE_NAME bash -c "${GULP_SCRIPT} start:app" > /dev/null

  set_host $APP_CONTAINER_NAME

  docker logs -f $APP_CONTAINER_NAME
}

# Stops and removes the application container
# @type build
# @environment local machine
app_stop() {
  docker rm -f $APP_CONTAINER_NAME > /dev/null || :
}

app_build() {
  app_stop

  if [ ! -f "./build/firebase.env" ]; then
    echo "

    Please create the /build/firebase.env file.

    "
    exit 0
  fi

  docker run \
    -v $PWD:/app \
    -h $APP_CONTAINER_NAME \
    -d \
    --env-file ./build/default.env \
    --env-file "./build/firebase.env" \
    -e NODE_ENV="${APP_ENV}" \
    -t \
    --name $APP_CONTAINER_NAME \
    $APP_IMAGE_NAME bash -c "${GULP_SCRIPT} build:app" > /dev/null

  docker logs -f $APP_CONTAINER_NAME
}
# Opens the app page in a browser with the disabled CORS settings
# @type build
# @environment local machine
browser_start() {
  chromium-browser --user-data-dir --disable-web-security http://$APP_CONTAINER_NAME:$APP_PORT &
}

# Builds the docker file
# @type build
# @environment local machine
docker_build() {
  cd build
  docker build -t $APP_IMAGE_NAME .
}

# Execute tasks
# @type build
# @environment container
app_exec() {
  docker run \
    -v $PWD:/app \
    -h $APP_CONTAINER_NAME \
    --env-file ./build/default.env \
    --env-file "./build/firebase.env" \
    -t \
    --rm \
    $APP_IMAGE_NAME bash -c "${GULP_SCRIPT} ${1} ${2} ${3} ${4} ${5}"
}

app_test() {
  TESTS=$1
  if [ ! $TESTS ]; then
    TESTS='all'
  fi
  app_exec "tests:${TESTS}"
}

deploy() {

  if [ ! -z $PARAM1 ] && [ $PARAM1 = "production" ]; then
    read -r -p "Are you sure you want to deploy to production? [y/N] " response
    case "$response" in
        [yY][eE][sS]|[yY])
            echo "Deploying to production"
            sleep 3
            ;;
        *)
            echo "Task aborted"
            exit
            ;;
    esac
  fi

  source "./build/firebase.env"
  firebase deploy --only hosting --project $FIREBASE_PROJECTID
}

postinstall() {
  docker_build
}

# Start a task
# @type build
# @environment container
# @param gulp task name
task_start() {
  eval "${GULP_SCRIPT} ${1}"
}

icons_build() {
  root=$PWD
  cd src/client/views/icons

  for file in *.svg; do
    result=$($root/node_modules/.bin/html2pug --fragment=false < $file)
    viewBox=$(echo $result | grep -Po "viewBox='\K.*?(?=')")
    $root/node_modules/.bin/html2pug --fragment=false < $file | sed -e '1,3d' | (echo "svg(viewBox=\"$viewBox\")" && cat) | (echo '---' && cat) > $file.pug
    rename -v 's/\.svg//' *.pug
  done

  rm *.svg
}

# ------ RUN TASK ------
title "APPLICATION ENVIRONMENT: ${APP_ENV}"
title "Running task ${TASK} ${PARAM1} ${PARAM2} ${PARAM3}"
$TASK $PARAM1 $PARAM2 $PARAM3
