'use strict'

import 'dotenv/config'

import Fastify from 'fastify'
import fastifySSE from '@fastify/sse'

const CLIENTS = new Map()

const TOKEN = process.env.TOKEN

const fastify = Fastify({
  logger: false,
})

;(async () => {
  await fastify.register(fastifySSE)

  fastify.get('/sse/:player_id', { sse: true }, async (req: any, reply) => {
    if (!reply.sse) {
      return reply.code(403).send()
    }

    reply.sse.keepAlive()

    let player_id = req.params.player_id

    req.log.info(`see connect ${player_id}`)

    await reply.sse.send({ event: 'start', data: `myland sse ${player_id}` })

    CLIENTS.set(player_id, reply.sse)

    reply.sse.onClose(() => {
      req.log.info(`see close ${player_id}`)
      CLIENTS.delete(player_id)
    })
  })

  fastify.get('/client', (req: any, reply) => {
    if (req.query.token != TOKEN) {
      return reply.code(403).send()
    }

    return reply.send([...CLIENTS.keys()])
  })

  fastify.post('/push', (req: any, reply) => {
    if (req.body.token != TOKEN) {
      return reply.code(403).send()
    }

    let { player_hashids, event, data } = req.body

    let count = 0
    for (let player_id of player_hashids) {
      let sse = CLIENTS.get(player_id)
      if (sse) {
        count += 1
        sse.send({
          event,
          data,
        })
      }
    }

    reply.send(count)
  })

  const address = await fastify.listen({
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
  })
  console.log(`run ${address}`)
})()
