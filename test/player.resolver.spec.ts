import { Test } from '@nestjs/testing';
import { PlayerResolver } from '../src/entrypoints/player.resolver';
import { PlayerServiceImpl } from '../src/domain/services/manager';

const mockPlayerService = {
  createPlayer: jest.fn(),
  getPlayer: jest.fn(),
  deletePlayer: jest.fn(),
};

describe('PlayerResolver', () => {
  let resolver: PlayerResolver;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PlayerResolver,
        { provide: PlayerServiceImpl, useValue: mockPlayerService },
      ],
    }).compile();

    resolver = moduleRef.get(PlayerResolver);

    jest.clearAllMocks();
  });

  it('should create player', async () => {
    const mockPlayer = { id: 'abc1233', name: 'Jonas Jonaitis' };
    mockPlayerService.createPlayer.mockResolvedValue(mockPlayer);

    const result = await resolver.createPlayer('Jonas Jonaitis');

    expect(mockPlayerService.createPlayer).toHaveBeenCalledWith('Jonas Jonaitis');
    expect(result).toEqual(mockPlayer);
  });

  it('should get player', async () => {
    const mockPlayer = { id: 'abc1233', name: 'Jonas Jonaitis' };
    mockPlayerService.createPlayer.mockResolvedValue(mockPlayer);
    mockPlayerService.getPlayer.mockResolvedValue(mockPlayer);

    await resolver.createPlayer('Jonas Jonaitis');
    const result = await resolver.getPlayer('abc1233');

    expect(mockPlayerService.getPlayer).toHaveBeenCalledWith('abc1233');
    expect(result).toEqual(mockPlayer);
  });

  it('should delete createdplayer', async () => {
    const mockPlayer = { id: 'abc1233', name: 'Jonas Jonaitis' };
    mockPlayerService.createPlayer.mockResolvedValue(mockPlayer);
    mockPlayerService.deletePlayer.mockResolvedValue(true);

    await resolver.createPlayer('Jonas Jonaitis');
    const result = await resolver.deletePlayer('abc1233');

    expect(mockPlayerService.deletePlayer).toHaveBeenCalledWith('abc1233');
    expect(result).toBe(true);
  });
});