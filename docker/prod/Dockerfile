FROM node:10

RUN apt update && apt install python3-pip -y

RUN apt-get clean && apt-get update && apt-get install -y locales \
            && apt-get install nano -y
RUN locale-gen en_US.UTF-8

# Set the locale
RUN sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
    locale-gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8



# Create app directory
WORKDIR /usr/src/app

COPY ./app/package*.json ./

#USER node
RUN npm install

COPY ./app .

WORKDIR /usr/src/app/templates
RUN pip3 install -r requirements.txt

#RUN addgroup --gid 1024 roman
#RUN adduser --disabled-password --gecos "" --force-badname --ingroup 1024 roman
#
#USER roman
WORKDIR /usr/src/app
RUN cp -R ./public/fonts/Cairo /usr/local/share/fonts/sample/

# Expose website on port
EXPOSE 3000

CMD ["node", "app.js"]