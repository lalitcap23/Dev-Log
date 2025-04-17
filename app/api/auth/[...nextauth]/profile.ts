import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const defaultProfile = {
      name: 'Lalit',
      email: 'lalit@example.com',
      mumasies: 5,
      completionRate: 78,
      totalTasks: 20,
      completedTasks: 15,
    };

    res.status(200).json(defaultProfile);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
