#a-bad-website-template

step 1) Find and replace YOURDOMAINNAMEHERE with your domain name and tld (ex: sethacked.com) or the setup script will not work...

step 2) Go to https://m.do.co/c/7d06bee71455 (Digital Ocean) and deploy an Ubuntu 16.04 server. ($5/mo)
    use my referral and you can run a website for free for 2 months.

step 3) Configure your domains nameservers to point at digital oceans nameservers and set up your domain in digital ocean.

step 4) SSH into your new server and run this setup script:

    apt-get update && apt-get install build-essential libpcre3 libpcre3-dev libssl-dev unzip letsencrypt git && curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash && export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" && nvm install node && mkdir nginx-install && cd nginx-install && wget http://nginx.org/download/nginx-1.13.2.tar.gz && tar -zxvf nginx-1.13.2.tar.gz && cd nginx-1.13.2 && ./configure && make && make install && /usr/local/nginx/sbin/nginx && letsencrypt certonly -a webroot --webroot-path=/usr/local/nginx/html -d YOURDOMAINNAMEHERE -d www.YOURDOMAINNAMEHERE && /usr/local/nginx/sbin/nginx -s stop && cd ~ && git clone https://github.com/anticlergygang/a-bad-website-template.git websiteroot && cd websiteroot && npm install

step 5) Configure the constants domainName and serverIP in ~/websiteroot/servers.js

step 6) Configure establishConnectionPromise parameter domainName in ~/websiteroot/database/js/landing.js

step 7) Configure establishConnectionPromise parameter domainName in ~/websiteroot/database/js/main.js

Questions? go to https://discord.gg/8SrxDyF with them.