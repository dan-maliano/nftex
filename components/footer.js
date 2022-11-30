export default function Footer() {
    return (
        <div className="footer">
            <div className="w-full 2xl:max-w-screen-2xl m-auto">
                <div className="footer__wrap m-4 sm:m-8 lg:m-[7vw]">
                    <div className="footer__company">
                        <img src="/assets/svg/logo-dark.svg" alt="logo" className="footer__logo"></img>
                        <p className="footer__company-descr">Discover, Collect, and Sell Extraordinary NFTs</p>
                        <p className="footer__copyright">© 2022 NFTEX Market. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}