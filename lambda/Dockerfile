FROM public.ecr.aws/lambda/nodejs:16

COPY package.json package.json
#COPY package-lock.json package-lock.json
 
RUN npm install
 
COPY . .

COPY app.js   ./
CMD ["app.handler"]