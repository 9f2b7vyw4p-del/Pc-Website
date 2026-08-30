# Architecture

## Target architecture

User
→ Cloudflare
→ authenticated endpoint
→ Cloudflare Tunnel
→ Mac mini
→ Wake-on-LAN
→ Windows PC

The Mac mini is the LAN control agent.

The Windows PC remains inaccessible directly from the public internet.

## Initial operation

The `/pc` frontend will request the Mac mini agent to wake the PC.

The agent will send a Wake-on-LAN magic packet to:

`a0:ad:9f:1c:e0:20`
