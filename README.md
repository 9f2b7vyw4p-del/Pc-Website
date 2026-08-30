# Osayona PC

Personal PC control dashboard for:

https://osayona.com/pc

## Purpose

Provide authenticated remote control of a Windows 11 Pro PC using an
always-on Mac mini as the local network agent.

Initial functionality:

- Wake Windows PC using Wake-on-LAN
- Detect PC availability
- Connect using the existing remote desktop setup

## Architecture

User → Cloudflare → Mac mini → Windows PC

GitHub is the source of truth for the project.

## Development

Frontend:

`frontend/`

Mac mini agent:

`agent/`

Architecture documentation:

`docs/`
