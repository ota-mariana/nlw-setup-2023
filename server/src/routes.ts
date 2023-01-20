import { prisma } from './lib/prisma';
import { z } from 'zod';
import { FastifyInstance } from 'fastify';
import dayjs from 'dayjs';

export async function appRoutes(app: FastifyInstance) {
  app.post('/habits', async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      habitWeekDays: z.array(z.number().min(0).max(6))
    })

    const { title, habitWeekDays } = createHabitBody.parse(request.body)

    const today = dayjs().startOf('day').toDate()
    
    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        habitWeekDays: {
          create: habitWeekDays.map(weekDay => {
            return {
              week_day: weekDay,
            }
          })
        }
      }
    })
  })

  app.get('/day', async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date()
    })

    const { date } = getDayParams.parse(request.query)
    const parsedDate = dayjs(date).startOf('day')
    const weekDay = parsedDate.get('day')

    const allHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },
        habitWeekDays: {
          some: {
            week_day: weekDay,
          }
        }
      }
    })

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        dayHabits: true,
      }
    })

    const completedHabits = day?.dayHabits.map((dayHabit) => {
      return dayHabit.habit_id
    })

    return { allHabits };
  })
}
