import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // Create a fake copy of the users service
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email)
                return Promise.resolve(filteredUsers)
            },
            create: (email: string, password: string) => {
                const user = {id: Math.floor(Math.random() * 999999), email, password} as User
                users.push(user)
                return Promise.resolve(user)
            }
        }
        // fakeUsersService = {
        //     find: () => Promise.resolve([]),
        //     create: (email: string, password: string) => Promise.resolve({id: 1, email, password} as User)
        // }
        
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();

        service = module.get(AuthService);
    });

    it('Can cretae an instance of auth service', async () => {
        expect(service).toBeDefined();
    })

    it('Creates a new user with a salted and hashed pasword', async () => {
        const user = await service.signup('sadsadgsag@sdaskd.com', 'dsadas');

        expect(user.password).not.toEqual('dsadas');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    it('Throws an error if user signs up with email that is in use', async () => {
        // fakeUsersService.find =  () => Promise.resolve([{ id: 1, email: 'abc@def.com', password: '123'} as User])
        await service.signup('abc@def.com', '123456');
        await expect(service.signup('abc@def.com', '123456')).rejects.toBeInstanceOf(BadRequestException)
    })

    it('Throws if signin is called with an unused email', async () => {
        await expect(service.signin('abc@def.com', '123456')).rejects.toBeInstanceOf(NotFoundException)
    })

    it('Throws if an invalid password is provided', async () => {
        // fakeUsersService.find = () => Promise.resolve([{ email: 'asdf@asdf.com', password: '123'} as User])
        await service.signup('asdf@asdf.com', '123')
        await expect(service.signin('asdf@asdf.com', '1234')).rejects.toBeInstanceOf(BadRequestException)
    })

    it('Returns a user if correct oasswird is provided', async () => {
        // fakeUsersService.find = () => Promise.resolve([{ email: 'asdf@asdf.com', password: '48d75cfeb3d69d20.cb717782436580905bed187b3194a5e91b1cd905eddb9212120433e6eb0c6cec'} as User])
        await service.signup('asdf@asdf.com', 'mypassword')

        const user = await service.signin('asdf@asdf.com', 'mypassword')
        expect(user).toBeDefined()
    })
})