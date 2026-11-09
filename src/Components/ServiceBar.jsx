import {
  Truck,
  ShieldCheck,
  CreditCard,
  Headphones,
} from "lucide-react";

import { Link } from "react-router-dom";

function ServiceBar() {

  const services = [
    {
      icon: <Truck />,
      title: "Free Shipping",
      text: "On all orders",
      link: "/terms-conditions",
    },
    {
      icon: <ShieldCheck />,
      title: "Easy Returns",
      text: "Within 7 days",
      link: "/return-policy",
    },
    {
      icon: <CreditCard />,
      title: "Secure Payment",
      text: "100% secure",
      //link: "/payment-method",
    },
    {
      icon: <Headphones />,
      title: "24/7 Support",
      text: "We're here to help",
      link: "/contact",
    },
  ];

  return (
    <section className="service-bar">

      {services.map((service, index) => (
        <Link
          to={service.link}
          className="service-item"
          key={index}
        >

          <div className="service-icon">
            {service.icon}
          </div>

          <div>
            <h4>{service.title}</h4>
            <p>{service.text}</p>
          </div>

        </Link>
      ))}

    </section>
  );
}

export default ServiceBar;