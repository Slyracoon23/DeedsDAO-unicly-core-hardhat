import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber, Contract } from 'ethers';



describe('DeedsDAO', () => {
    let factory_instance: Contract



    beforeEach(async () => {
        
        // Get owner address
        const owner = (await ethers.getSigners())[0];

        // Get contract definition
        const factory = await ethers.getContractFactory("UnicFactory");

        factory_instance = await factory.deploy(owner.address);

      });

      // Just creates uTokens. Does not deposit NFTs -- Look at Convert.spec.ts
      it('create uTokens', async () => {

        expect(await factory_instance.uTokensLength()).to.be.eq(0)

        await expect(factory_instance.createUToken(1000, 3, 'Star Wars Collection', 'uSTAR', 950, 'Leia\'s Star Wars NFT Collection')).to.be.revertedWith('Unic: MIN PRECISION')
        await expect(factory_instance.createUToken(1000, 18, 'Star Wars Collection', 'uSTAR', 1001, 'Leia\'s Star Wars NFT Collection')).to.be.revertedWith('Unic: THRESHOLD GREATER THAN SUPPLY')

        await factory_instance.createUToken(1000, 18, 'Star Wars Collection', 'uSTAR', 950, 'Leia\'s Star Wars NFT Collection')
        const address = await factory_instance.uTokens(0)
        expect(await factory_instance.uTokensLength()).to.be.eq(1)
        expect(await factory_instance.getUToken(address)).to.be.eq(0)

        await factory_instance.createUToken(1000, 8, 'Unicly NFT Collection', 'uNIC', 950, 'Leia\'s Unicly NFT Collection')
        const address2 = await factory_instance.uTokens(1)
        expect(await factory_instance.uTokensLength()).to.be.eq(2)
        expect(await factory_instance.getUToken(address2)).to.be.eq(1)

      });



});
