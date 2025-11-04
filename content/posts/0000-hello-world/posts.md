---
title: "My Local AI Development Setup"
date: 2025-11-03T23:40:18Z
# weight: 1
# aliases: ["/first"]
tags: ["blog"]
author: "dnht"
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false
description: "First attempt at creating a blog post"
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
    URL: "https://github.com/dnhtmir.github.io/content"
    Text: "Suggest Changes" # edit text
    appendFilePath: true # to append file path to Edit link
---

# My Local, Open-Source AI-Assisted Disposable Development Environments

## Introduction

Welcome, fellow reader. This is my first ever post on this GitHub page, and the first time I'm publicly talking about a stupid little project I made at home. If you see anything I did wrong or that I could improve, feel free to reach out to me!

## The Goal

The goal of this project was to create:
1. Disposable Development Environments: my software development machines usually end up with a lot of software that I only use once, just to try some stuff out. Unfortunately, since not every language contains virtual environments like `python`, and since I like to keep my main operating system as clean as possible, I decided to use Virtual Machines for development.
2. AI-Assisted Development Environments: I enjoy the convenience of using Cursor AI or GitHub Copilot, and I found that these tools are actually very useful for working on small, personal projects. However, I am a little bit of a privacy freak and, since I don't usually get a lot of time to work on my personal stuff, I didn't want to pay a monthly fee for a subscription that I would only use once every 3 months. For that reason, I decided to give local LLMs a try.
3. AI-Assisted Ethical Hacking: The most popular and powerful LLMs freely available on the internet are highly censored, and might not help out with development of certain types of software development. It is sometimes possible to convince the LLM that we're playing a CTF, but there's always some degree of resistance. One of the goals of this project was to also test out how uncensored/abliterated models behave in this type of situation.

Since I'm using Fedora as my daily driver, I am using `qemu-kvm` for my virtual machines and I'll be using `ollama` to manage my models.

## Additional requirements

After deciding to go for development in virtual machines and using local LLMs to support software development, additional requirements came up.

### How to seamlessly let every VM use GPU-powered models?

I didn't want:
- My models to run CPU only, because then I wouldn't be using my machine's resources to their full extent
- To deal with GPU passthrough to multiple machines
- To have to manually do a lot of stuff every time I switched to another machine

So, I found out that the [continue vscode extension](https://docs.continue.dev/) can connect to remote `ollama` instances. Pretty cool! The only thing left to do was to find a **secure** way to let my VMs reach the `ollama` instance running on my host.

### How to keep the host Operating System as clean as possible?

To keep my main operating system as clean as possible, I opted to run ollama out of a container. Thankfully, Fedora 43 is shipped with `podman`, so I didn't even have to install anything else.

### How to only allow Virtual Machines to connect to the host on a specific port?

One of the Virtual Machines I intended to use was a Ubuntu machine for "normal" software development. The other one would be a Kali Linux machine to play some CTF challenges. However, I didn't want my host to be fully reachable from my Kali machine, I only wanted to expose what was strictly necessary for AI-assisted development.

### Other possible requirements

In my case, I had to install [ROCm](https://www.amd.com/pt/products/software/rocm.html), since I have an AMD GPU. In order to install it on Fedora 43, the following command can be executed:

```
dnf install -y rocm
```

## The solution

To be continued...
