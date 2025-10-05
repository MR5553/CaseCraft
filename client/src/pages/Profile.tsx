import axios from "axios";
import Input from "../components/Input";
import { useAuth } from "../store/auth.store";
import { Link } from "react-router-dom";
import { Github, Google } from "../components/Icons";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addressSchema, type address } from "../lib/schema";
import { toast } from "sonner";
import { api } from "../lib/axios";
import { formatDate } from "../lib/utils";


export default function Profile() {
    const { user, setUser } = useAuth();

    const { register, handleSubmit, setValue, formState: { errors, isDirty, isValid, isSubmitting } } = useForm({ mode: "all", resolver: yupResolver(addressSchema), defaultValues: user.address });

    const hasProvider = (name: "google" | "github") => user.providers?.some(p => p.provider === name) ?? false;


    const getUserLocation = () => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            await reverseGeocode(latitude, longitude);
        }
        );
    };

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse`,
                { params: { lat, lon: lng, format: "json" } }
            );
            console.log(data);


            if (data?.address) {
                setValue("address_line_1", data.address.house_number);
                setValue("address_line_2", data.address.road || data.address.residential || data.address.suburb);
                setValue("landmark", data.address.landmark);
                setValue("city", data.address.city);
                setValue("state", data.address.state);
                setValue("pincode", data.address.postcode);
                setValue("country", data.address.country);
            }
        } catch (error) {
            console.error("Reverse geocoding failed:", error);
        }
    };

    const submit = async (address: address) => {
        try {
            const { data } = await api.put("api/auth/me/update", address);

            if (data.success) {
                setUser(data.user)
                toast.success(data.message);
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className="w-2xl flex flex-col gap-6 p-4">
            <div className="flex gap-6 items-center">
                <img
                    src={user.profileImage?.imageUrl || undefined}
                    alt={user.name}
                    className="w-20 h-auto object-cover rounded-full"
                />
                <div>
                    <h1 className="text-2xl font-bold leading-snug">{user.name}</h1>
                    <p className="text-neutral-600 text-sm">Account created : {formatDate(user.createdAt)}</p>
                </div>
            </div>

            <div>
                <p className="text-neutral-400 mb-6">Personal details</p>

                <form className="flex flex-col gap-6 mb-6">
                    <div className="flex items-center justify-between gap-4">
                        <span>Full name</span>
                        <span className="text-neutral-500">{user.name}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <span>Email address</span>
                        <span className="text-neutral-500">{user.email}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <span>Phone number</span>
                        <span className="text-neutral-500">{user.phone || "not added yet"}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <span>Google account</span>
                        {hasProvider("google") ?
                            <div className="text-green-600 font-medium inline-flex gap-1">
                                <Google className="w-6 h-6" /> Connected
                            </div>
                            :
                            <Link
                                to={`${import.meta.env.VITE_SERVER_URL}/auth/google`}
                                className="inline-flex items-center justify-center gap-1 whitespace-nowrap text-base font-medium"
                            >
                                <Google className="w-6 h-6" /> Google
                            </Link>
                        }
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <span>GitHub account</span>
                        {hasProvider("github") ?
                            <div className="text-green-600 font-medium inline-flex gap-1">
                                <Github className="w-6 h-6" /> Connected
                            </div>
                            :
                            <Link
                                to={`${import.meta.env.VITE_SERVER_URL}/auth/github`}
                                className="inline-flex items-center justify-center gap-1 whitespace-nowrap text-base font-medium"
                            >
                                <Github className="w-6 h-6" /> GitHub
                            </Link>
                        }
                    </div>
                </form>

                <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
                    <p className="text-neutral-400">Address details</p>

                    <div>
                        <Input
                            type="text"
                            placeholder="Flat / House No., Building Name, Apartment Complex"
                            endIcon={<i className="ri-focus-3-line cursor-pointer" onClick={getUserLocation} />}
                            {...register("address_line_1")}
                        />
                        {errors.address_line_1 &&
                            <span className="text-sm text-red-500">{errors.address_line_1.message}</span>
                        }
                    </div>

                    <div>
                        <Input
                            type="text"
                            placeholder="Street Name, Sector, Colony, or Locality"
                            {...register("address_line_2")}
                        />
                        {errors.address_line_2 &&
                            <span className="text-sm text-red-500">{errors.address_line_2.message}</span>
                        }
                    </div>

                    <div>
                        <Input
                            type="text"
                            placeholder="Nearby Landmark"
                            {...register("landmark")}
                        />
                        {errors.landmark &&
                            <span className="text-sm text-red-500">{errors.landmark.message}</span>
                        }
                    </div>

                    <div>
                        <Input
                            type="text"
                            placeholder="Enter City (e.g., Faridabad)"
                            {...register("city")}
                        />
                        {errors.city &&
                            <span className="text-sm text-red-500">{errors.city.message}</span>
                        }
                    </div>

                    <div>
                        <Input
                            type="text"
                            placeholder="Pincode / Postal Code"
                            {...register("pincode")}
                        />
                        {errors.city &&
                            <span className="text-sm text-red-500">{errors.city.message}</span>
                        }
                    </div>

                    <div>
                        <Input
                            type="text"
                            placeholder="Enter State (e.g., Haryana)"
                            {...register("state")}
                        />
                        {errors.state &&
                            <span className="text-sm text-red-500">{errors.state.message}</span>
                        }
                    </div>

                    <div>
                        <Input
                            type="text"
                            placeholder="Enter Country (e.g., India)"
                            {...register("country")}
                        />
                        {errors.country &&
                            <span className="text-sm text-red-500">{errors.country.message}</span>
                        }
                    </div>

                    <Button
                        type="submit"
                        variant="black"
                        size="default"
                        disabled={!isValid || !isDirty || isSubmitting}
                    >
                        Update address
                    </Button>
                </form>
            </div >
        </section >
    )
}