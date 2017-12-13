#a-basic-website-template

Questions? -> https://discord.gg/RRHvYUe -> @anticlergy 

step 1) Find and replace YOURDOMAINNAMEHERE with your domain name and tld (ex: coolwebsite.com) or the setup script will not work...

step 2) Go to https://m.do.co/c/7d06bee71455 (Digital Ocean) and deploy an Ubuntu 16.04 server. ($5/mo)
    use my referral and you can run a website for free for 2 months.
    ~Be sure to include your SSH key when you create your new server.

step 3) Set up your domain in the digital ocean networking tab. Configure your domains nameservers to point at digital oceans nameservers in your domains control pannel. (I use domain.com)

step 4) SSH into your droplet and run this setup script:

    apt-get update && apt-get install software-properties-common && add-apt-repository ppa:certbot/certbot && apt-get update && apt-get install certbot git && certbot certonly --standalone -d YOURDOMAINNAMEHERE -d www.YOURDOMAINNAMEHERE && curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash && export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" && nvm install node && git clone https://github.com/anticlergygang/a-bad-website-template.git websiteroot && cd websiteroot && npm install

step 5) Configure the constants domainName and serverIP in ~/websiteroot/servers.js

step 6) Configure establishConnectionPromise parameter domainName in ~/websiteroot/database/js/landing.js

step 7) Configure establishConnectionPromise parameter domainName in ~/websiteroot/database/js/main.js

step 8) node servers.js

step 9) ????

step 10) Welcome to hell.