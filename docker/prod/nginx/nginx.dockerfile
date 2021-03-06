FROM nginx:1.13.3
MAINTAINER Abdulrahman Alshehri <aalshehri08@hotmail.com>

# Copy the Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose website on port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]