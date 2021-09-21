# Modules

## Add Module

Module should be:

- In [modules directory](../src/modules).
- A class and its methods should have [expose decorater](../src/helpers/expose)
- Exported in [index file](../src/modules)

## Supported Modules

### Twins

- **Create**
   cmd: `twinserver.twins.create`
   payload: `'{"ip": "<yggdrasil ip>"}'`
- **Get**
   cmd: `twinserver.twins.get`
   payload: `'{"id": <twin id>}'`
- **List**
   cmd: `twinserver.twins.list`
   payload: `'""'`
- **Delete**
   cmd: `twinserver.twins.delete`
   payload: `'{"id": <twin id>}'`

### Contracts

- **Create**
   cmd: `twinserver.contracts.create`  
   payload: `'{"node_id": "<zos node id>", "hash": "<deployment challenge hash>", "data": "<deployment data>", "public_ip": <number of public IPs>}'`
- **Get**
   cmd: `twinserver.contracts.get`
   payload: `'{"id": <contract id>}'`
- **Update**
    cmd: `twinserver.contracts.update`
    payload: `'{"id": <contract id>, "hash": "<deployment challenge hash>", "data": "<deployment data>"}'`
- **Cancel**
   cmd: `twinserver.contracts.cancel`
   payload: `'{"id": <contract id>}'`

### ZOS

- **Deploy**
   cmd: `twinserver.zos.deploy`
   payload: the same as zos deployment without signing with additional parameter `'{"node_id": <zos node id> }'`
**Note:** `node_id` will be optional when the grid3_proxy_server is ready to be used.

### Generic Machine

- **Deploy**
    cmd: `twinserver.machine.deploy`
    payload:

```json
{
    "node_id": 5,
    "disks": [
        {
            "name": "hamadadisk",
            "size": 10,
            "mountpoint": "/hamada"
        }
    ],
    "network": {
        "ip_range": "10.200.0.0/16",
        "name": "hamada"
    },
    "public_ip": true,
    "cpu": 1,
    "memory": 1024,
    "name": "hamada",
    "flist": "https://hub.grid.tf/tf-official-apps/base:latest.flist",
    "entrypoint": "/sbin/zinit init",
    "metadata": "",
    "description": "",
    "env": {
        "SSH_KEY": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDmm8OzLt+lTdGaMUwMFcw0P+vr+a/h/UsR//EzzeQsgNtC0bdls4MawVEhb3hNcycEQNd2P/+tXdLC4qcaJ6iABYip4xqqAeY098owGDYhUKYwmnMyo+NwSgpjZs8taOhMxh5XHRI+Ifr4l/GmzbqExS0KVD21PI+4sdiLspbcnVBlg9Eg9enM///zx6rSkulrca/+MnSYHboC5+y4XLYboArD/gpWy3zwIUyxX/1MjJwPeSnd5LFBIWvPGrm3cl+dAtADwTZRkt5Yuet8y5HI73Q5/NSlCdYXMtlsKBLpJu3Ar8nz1QfSQL7dB8pa7/sf/s8wO17rXqWQgZG6JzvZ root@ahmed-Inspiron-3576"
    }
}

```

**Note:** disk size in GB, memory in MB, disk name should be different than the machine name

- **List**
cmd: `twinserver.machine.list`
payload: `'""'`

- **Get**
cmd: `twinserver.machine.get`
payload: `{"name": "<deployment name>"}`

- **Delete**
cmd: `twinserver.machine.delete`
payload: `{"name": "<deployment name>"}`

### Kubernetes

single master and multiple workers.

- **Deploy**
    cmd: `twinserver.k8s.deploy`
    payload:

```json
{
        "name": "mon69t5",
        "secret": "hamadaellol",
        "network": {
                "name": "hamadanet",
                "ip_range": "10.201.0.0/16"
        },
        "masters": [
            {
                "name": "master1",
                "node_id": 3,
                "cpu": 1,
                "memory": 1024,
                "disk_size": 15,
                "public_ip": true
            }
        ],
        "workers": [
            {
                "name":"worker1" ,
                "node_id": 2,
                "cpu": 1,
                "memory": 1024,
                "disk_size": 15,
                "public_ip": false
            }
        ],
        "metadata": "",
        "description": "",
        "ssh_key": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDmm8OzLt+lTdGaMUwMFcw0P+vr+a/h/UsR//EzzeQsgNtC0bdls4MawVEhb3hNcycEQNd2P/+tXdLC4qcaJ6iABYip4xqqAeY098owGDYhUKYwmnMyo+NwSgpjZs8taOhMxh5XHRI+Ifr4l/GmzbqExS0KVD21PI+4sdiLspbcnVBlg9Eg9enM///zx6rSkulrca/+MnSYHboC5+y4XLYboArD/gpWy3zwIUyxX/1MjJwPeSnd5LFBIWvPGrm3cl+dAtADwTZRkt5Yuet8y5HI73Q5/NSlCdYXMtlsKBLpJu3Ar8nz1QfSQL7dB8pa7/sf/s8wO17rXqWQgZG6JzvZ root@ahmed-Inspiron-3576"
    }
```

**Note:** disk size in GB, memory in MB, masters and workers names should be different

- **List**
cmd: `twinserver.k8s.list`
payload: `'""'`

- **Get**
cmd: `twinserver.k8s.get`
payload: `{"name": "<deployment name>"}`

- **Delete**
cmd: `twinserver.k8s.delete`
payload: `{"name": "<deployment name>"}`

- **Add worker**
cmd: `twinserver.k8s.add_worker`
payload:

```json
{
        "deployment_name": "sun199t2",
        "name": "sun199t1worker5",
        "node_id": 5,
        "cpu": 2,
        "memory": 1024,
        "disk_size": 15,
        "public_ip": false
    }
```

- **Delete worker**
cmd: `twinserver.k8s.delete_worker`
payload:

```json
{
        "deployment_name": "sun199t2",
        "name": "sun199t1worker5",
    }
```

### zdb

- **Deploy**
    cmd: `twinserver.zdbs.deploy`
    payload:

```json
{
        "name": "hamada",
        "zdbs": [{
            "name": "zdb1",
            "node_id": 3,
            "mode": "seq",
            "disk_size": 10,
            "disk_type": "hdd",
            "public": true,
            "namespace": "hamadaspace",
            "password": "hamadaellol",
        }, {
            "name": "zdb2",
            "node_id": 3,
            "mode": "seq",
            "disk_size": 10,
            "disk_type": "hdd",
            "public": true,
            "namespace": "hamadaspace",
            "password": "hamadaellol",
        }],
        "metadata": "",
        "description": ""
    }
```

**Note:** disk size in GB, zdb names should be different

- **List**
cmd: `twinserver.zdbs.list`
payload: `'""'`

- **Get**
cmd: `twinserver.zdbs.get`
payload: `{"name": "<deployment name>"}`

- **Delete**
cmd: `twinserver.zdbs.delete`
payload: `{"name": "<deployment name>"}`

- **Add zdb**
cmd: `twinserver.zdbs.add_zdb`
payload:

```json
{
        "deployment_name": "sun199t1",
        "name": "hamada1",
        "node_id": 2,
        "mode": "seq",
        "disk_size": 10,
        "disk_type": "hdd",
        "public": true,
        "namespace": "hamadaspace",
        "password": "hamada12345",

    }
```

- **Delete zdb**
cmd: `twinserver.zdbs.delete_zdb`
payload:

```json
{
        "deployment_name": "sun199t1",
        "name": "hamada1",
    }
```
