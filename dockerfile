FROM node:12.0.0-alpine as prod-fileupload-17-08-23-build1.0 
WORKDIR /work/fileupload/
COPY ./package.json /work/fileupload/package.json
RUN npm install
COPY ./ /work/
CMD node .