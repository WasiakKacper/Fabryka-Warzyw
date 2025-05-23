import { useState, useEffect } from "react";

const RODOmodal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("rodoConsent");
    if (!consent) setIsOpen(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("rodoConsent", "accepted");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full space-y-4">
        <h2 className="text-xl font-semibold">
          Zgoda na przetwarzanie danych (RODO)
        </h2>
        <p className="text-sm text-gray-700">
          Korzystając ze sklepu, wyrażasz zgodę na przetwarzanie Twoich danych
          osobowych:
          <strong>
            {" "}
            imienia, nazwiska, adresu e-mail, numeru telefonu oraz adresu
            zamieszkania
          </strong>
          . Dane te są niezbędne do realizacji zamówień i prawidłowego
          funkcjonowania sklepu.
        </p>
        <p className="text-sm text-gray-700">
          Administratorem danych jest właściciel sklepu. Dane nie będą
          przekazywane podmiotom trzecim i są przetwarzane zgodnie z
          obowiązującym prawem.
        </p>
        <div className="flex justify-end">
          <button
            onClick={handleAccept}
            className="bg-(--accent) text-white px-4 py-2 rounded-lg hover:bg-(--hoverAccent) transition cursor-pointer"
          >
            Akceptuję
          </button>
        </div>
      </div>
    </div>
  );
};

export default RODOmodal;
