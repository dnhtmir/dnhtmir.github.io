---
title: "Building Local, Privacy‑Focused AI Development Environments"
date: 2025-11-04T22:08:18Z
# weight: 1
# aliases: ["/first"]
tags: ["local-llm", "virtualization", "development", "privacy", "ai"]
author: "dnht"
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false
description: "Privacy‑centric development environments with local LLMs and virtualization for secure, AI‑assisted coding"
canonicalURL: "https://canonical.url/to/page"
disableHLJS: true # to disable highlightjs
disableShare: false
disableHLJS: false
hideSummary: false
searchHidden: true
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
ShowRssButtonInSectionTermList: true
UseHugoToc: true
cover:
    image: "<image path/url>" # image path/url
    alt: "<alt text>" # alt text
    caption: "<text>" # display caption under cover
    relative: false # when using page bundles set this to true
    hidden: true # only hide on current single page
editPost:
    URL: "https://github.com/dnhtmir/dnhtmir.github.io/blob/main/content"
    Text: "Suggest Changes" # edit text
    appendFilePath: true # to append file path to Edit link
---

## Introduction

Welcome, fellow reader. This is my first ever post on this GitHub page, and the first time I'm publicly talking about a project I made at home. If you see anything I did wrong or that I could improve, feel free to reach out to me!

## Goal

The goal of this project was to create:
1. **Disposable Development Environments**: software development setups quickly accumulate tools and dependencies, making it difficult to maintain a clean slate. Unfortunately, since not every language contains virtual environments like `python`, and since I like to keep my main operating system as clean as possible, I decided to use Virtual Machines for development.
2. **AI-Assisted Development**: I enjoy the convenience of using Cursor AI or GitHub Copilot, and I found that these tools are actually very useful for working on small, personal projects. However, since I don't usually get a lot of time to work on my personal stuff, I didn't want to pay a monthly fee for a subscription that I would only use once every 3 months. For that reason, I decided to give local LLMs a try.
3. **AI-Assisted Ethical Hacking**: The most popular and powerful LLMs freely available on the internet are highly censored, and might not help out with development of certain types of software development. It is sometimes possible to convince the LLM that we're playing a CTF¹, but there's always some degree of resistance. One of the goals of this project was to also test out how uncensored/abliterated models behave in this type of situation.

¹**CTF** (Capture The Flag) is a cybersecurity competition where participants have to find a **flag** (usually, a string such as `CTF{s0m3th1n6}`) from a system, for example, by bypassing security measures to get access to it or exploring a vulnerability that forces it to leak information.

## Additional requirements

After deciding to go for development in virtual machines and using local LLMs to support software development, additional requirements came up.

### How to keep the host Operating System as clean as possible?

To keep my main operating system as clean as possible, I wanted to run LLMs out of a container.

### How to seamlessly let every VM use GPU-powered models?

I didn't want:
- My models to run CPU only, because then I wouldn't be using my machine's resources to their full extent
- To deal with GPU passthrough to multiple machines
- To have to manually do a lot of stuff every time I switched to another machine

This meant I had to find a tool similar to Cursor AI or Github Copilot that could connect to a remote service that would run on the host, using the GPU, and that all virtual machines could use seamlessly, at the same time.

### How to only allow Virtual Machines to connect to the host on a specific port?

One of the Virtual Machines I intended to use was a Kali Linux machine to play some CTF challenges. For this reason, I didn't want my host to be fully reachable from this machine, which meant I needed to expose only what was strictly necessary for AI-assisted development.

### How to manage models and interact with them in a more "regular" way?

It’s not always convenient to interact with local LLMs purely through APIs or CLI tools. For more “regular” use cases like chatting with a model, it’s useful to have a frontend.

### Other requirements

In my case, I had to install [ROCm](https://www.amd.com/pt/products/software/rocm.html), since I have an AMD GPU.

## Solution

Now that we're done with Goals and Additional Requirements, it's time to come up with the solution:
1. For disposable development environments, as previously stated, it was determined that Virtual Machines would be used. Since I'm using Fedora 43 as my daily driver, I opted to use `qemu-kvm`.
2. For AI assistance, I opted for `ollama` since it is available as an official Docker image, and it was very easy to set up. Also, some uncensored or abliterated models are available for download, which helped make this decision.
3. For containers, I opted for `podman` because it is shipped with Fedora by default, so I didn't even have to install anything else.
4. To allow VMs to use GPU-powered models, I found out that the [continue vscode extension](https://docs.continue.dev/) can connect to remote self-hosted `ollama` instances. Pretty cool!
5. To restrict access so that virtual machines could only connect to the host on a specific port, I configured the network using NAT. All that was required was opening port 11434 (`ollama`'s default) on the virtual machines' network.
6. Finally, to manage and interact with models, I decided to use `open-webui`, a simple and lightweight frontend that kind of resembles ChatGPT.

### Setting up Virtual Machines

I got a pre-built `qemu` VM from [Kali's website](https://www.kali.org/get-kali/#kali-virtual-machines) and built my own Ubuntu 25.10 machine. Then, I installed `vscode` and the `Continue.continue` extension from the [marketplace](https://marketplace.visualstudio.com/items?itemName=Continue.continue) in both of them.

<sup>Note: It's not in the scope of this article to explain how to import virtual machines or create your own ones, or how to install `vscode` on any of these distributions. However, there are plenty of good guides freely available online!</sup>

### Setting up the Ollama container

Getting Ollama running in a container was one of the trickiest parts, but the final command that worked looked like this:

```
podman run -d \
  --network isolated-llm-container-net \
  --device /dev/kfd \
  --device /dev/dri \
  -v ollama:/root/.ollama \
  -p 127.0.0.1:11434:11434 \
  -p 192.168.122.1:11434:11434 \
  --security-opt label=type:container_runtime_t \
  -e ROCR_VISIBLE_DEVICES=0 \
  --name ollama ollama/ollama:rocm
```

Option breakdown:
- `podman run -d`: start container in the background.  
- `--network isolated-llm-container-net`: custom network shared only with related containers.  
- `--device /dev/kfd`, `--device /dev/dri`: expose GPU devices for ROCm access.  
- `-v ollama:/root/.ollama`: persistent volume for Ollama data/config.  
- `-p 127.0.0.1:11434:11434`: expose service to host only.  
- `-p 192.168.122.1:11434:11434`: expose service to VMs on the NAT/VM network.  
- `--security-opt label=type:container_runtime_t`: Adjusts the SELinux label applied to the container process. This can be required on SELinux‑enforcing systems (like Fedora) to let the container access certain host resources (e.g., GPUs). On systems without SELinux, this flag is usually unnecessary. Be aware that changing SELinux labels can reduce confinement if misused, so apply it only when needed. More details about this option can be found [here](https://docs.podman.io/en/v4.6.0/markdown/options/security-opt.html). 
- `-e ROCR_VISIBLE_DEVICES=0`:  [ROCm variable](https://rocm.docs.amd.com/en/latest/conceptual/gpu-isolation.html) to select GPU(s).  
- `--name ollama`:  easy container reference.  

The container is isolated on a separate container network where it can only be accessed by the `open-webui` container, only required devices are passed through, and only necessary ports are exposed. This alligns with my goal of implementing a least‑privilege approach!

### Adding the Open WebUI container

Instructions to configure `open-webui` can be found in their [quick start guide](https://docs.openwebui.com/getting-started/quick-start)

```
podman run -d --network isolated-llm-container-net \
  --name openwebui \
  -p 127.0.0.1:3000:8080 \
  -p 192.168.122.1:3000:8080 \
  -e OLLAMA_BASE_URL=http://ollama:11434 \
  -v open-webui:/app/backend/data \
  ghcr.io/open-webui/open-webui:main
```

Key points:  
- Uses the same `isolated-llm-container-net` network for direct communication with `ollama`.  
- Port 3000 exposed to host and VM network for UI access.  
- A named volume `open-webui` is mounted to persist data across container restarts.
- `OLLAMA_BASE_URL` is used to tell `open-webui` where to reach `ollama`.  

### Downloading `Ollama` models

Ollama provides a [catalog of models](https://ollama.com/search) that can be pulled directly into a container by running the following command: 

```
podman exec -it ollama ollama pull <model>
```

### Opening ports on the Virtual Machines' network

By default, virtual machines managed through `libvirt` use a NATed network, so they can only reach the host on ports that are explicitly opened. On Fedora, I used `firewall-cmd` to allow access to Ollama and the WebUI by opening the required ports in the `libvirt` zone. On other operating systems or with different firewalls, the commands may vary, but the principle remains the same: expose only the ports you actually need.

It may be relevant to note that opening ports on the `libvirt` zone makes services reachable from **all** VMs on that network. 

```
firewall-cmd --permanent --zone=libvirt --add-port=3000/tcp
firewall-cmd --permanent --zone=libvirt --add-port=11434/tcp
firewall-cmd --reload
```

Note: might require `sudo`.

**Security note**: remember that exposing services to potentially compromised VMs carries risk, even with restricted ports. Treat guest machines as untrusted, and only open what is strictly necessary.

## The Outcome

With everything in place, I was able to spin up clean development VMs, connect them to a GPU‑powered local LLM, and even use a web interface for quick testing. The setup worked reliably and gave me exactly the isolation and flexibility I was aiming for!

## Conclusion

Overall, this project was a great learning experience. I got to deepen my knowledge of containers, virtualization, firewalls, networking, and local LLMs while building something genuinely useful. That said, with my 16 GB AMD GPU I was only able to reliably run 4B and 8B models, such as `gemma3:4b` and `dolphin3:8b`, which didn’t always deliver the results I hoped for. Additionally, uncensored/abliterated models lose some of their precision, making them less usable than regular models. Even with these limitations, the smaller models proved handy for quick coding snippets, lightweight experiments, and testing ideas without needing a full‑scale LLM.

Still, the process was fun, rewarding, and gave me a solid foundation for experimenting with more advanced setups in the future! Feel free to try this out yourself and reach out with suggestions for improvement!
