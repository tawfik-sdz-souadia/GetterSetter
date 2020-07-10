FROM crossbario/crossbar

USER root

RUN apt-get update

RUN apt-get install -y curl gnupg

RUN curl -sL https://deb.nodesource.com/setup_12.x  | bash -

RUN apt-get -y install nodejs

RUN mkdir /home/testproject/

WORKDIR /home/testproject/

COPY package.json .

RUN npm install 

RUN apt-get -y  install iputils-ping

COPY elasticsearch_client.js .

COPY elasticsearch.js . 

COPY data-pusher.js .

COPY elastic_config.json .

COPY autobahn_config_getter.json .

COPY autobahnGetter.js .

COPY autobahn_config_setter.json .

COPY autobahnSetter.js .

COPY config.json /node/.crossbar/

